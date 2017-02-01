var awesome = function awesome(param) {
  console.log('this is awesome ' + param);
}

awesome.init = (param) => {
  console.log('called init with ' + param);
}

window.awesome = awesome;
