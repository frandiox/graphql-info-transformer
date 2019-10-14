function getArgumentValue(info, arg) {
  switch (arg.kind) {
    case "FloatValue":
      return parseFloat(arg.value);
    case "IntValue":
      return parseInt(arg.value, 10);
    case "Variable":
      return info.variableValues[arg.name.value];
    case "ListValue":
      return arg.values.map(argument => getArgumentValue(info, argument));
    case "ObjectValue":
      return arg.fields.reduce((argValue, objectField) => {
        argValue[objectField.name.value] = getArgumentValue(
          info,
          objectField.value
        );
        return argValue;
      }, {});
    default:
      return arg.value;
  }
}

function getArguments(info, ast) {
  return ast.arguments.reduce((acc, argument) => {
    const argumentValue = getArgumentValue(info, argument.value);
    acc[argument.name.value] = argumentValue;
    return acc;
  }, {});
}

function isExcludedByDirective(info, ast) {
  const directives = ast.directives || [];
  let isExcluded = false;
  directives.forEach(directive => {
    const directiveArgument = directive.arguments[0].value;
    switch (directive.name.value) {
      case "include":
        isExcluded = isExcluded || !getArgumentValue(info, directiveArgument);
        break;
      case "skip":
        isExcluded = isExcluded || getArgumentValue(info, directiveArgument);
        break;
    }
  });
  return isExcluded;
}

function getFieldSet(info, asts = info.fieldASTs || info.fieldNodes, options) {
  // for recursion: fragments doesn't have many sets
  if (!Array.isArray(asts)) {
    asts = [asts];
  }

  const selections = asts.reduce((selections, source) => {
    if (source && source.selectionSet && source.selectionSet.selections) {
      selections.push.apply(selections, source.selectionSet.selections);
    }
    return selections;
  }, []);

  return selections.reduce((set, ast) => {
    if (isExcludedByDirective(info, ast)) {
      return set;
    }
    switch (ast.kind) {
      case "Field":
        if (ast.selectionSet) {
          const fields = getFieldSet(info, ast, options);
          const args =
            ast.arguments && ast.arguments.length > 0
              ? getArguments(info, ast)
              : null;
          set[ast.name.value] = options.parseSelectionFields
            ? options.parseSelectionFields({ fields, args })
            : fields;
        } else {
          set[ast.name.value] = true;
        }

        return set;
      case "InlineFragment":
        return Object.assign({}, set, getFieldSet(info, ast, options));
      case "FragmentSpread":
        return Object.assign(
          {},
          set,
          getFieldSet(info, info.fragments[ast.name.value], options)
        );
    }
  }, {});
}

module.exports = {
  infoToPhotonSelect(info) {
    return getFieldSet(info, undefined, {
      parseSelectionFields({ fields, args }) {
        return Object.assign({ select: fields }, args || {});
      }
    });
  }
};
