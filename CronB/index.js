
module.exports = function (context, myTimer) {
  var timeStamp = new Date().toISOString();

  if (myTimer.isPastDue) {
    context.log('JavaScript is running late!');
  }
  context.log('TimeTrigger2 function ran!', timeStamp);
  context.done();
};
