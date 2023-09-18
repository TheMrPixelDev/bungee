const expression = new RegExp(
  /^(\w+):\/\/([^\/]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/,
);

console.log(
  "https://helloworld.com/hello?key=value&this=is#now".match(
    /^(\w+):\/\/([^\/]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/,
  ),
);
