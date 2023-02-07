const filter = (property, type, opt, optValue) => {
  return {
    property: property,
    [type]: { [opt]: optValue },
  };
};

module.exports = {
  filter,
};
