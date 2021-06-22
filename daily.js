const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async () => {
  const result = {
      googlesheets: {},
      slack: {},
      giphy: {}
  };
  
  const momentTimezone = require('moment-timezone');
  let date = momentTimezone().tz('Europe/Moscow'); //sets the timezone of the date object to 'Europe/Moscow'
  let today_day = date.format('D'); //return the day 1, 2, 3, ... 31
  let today_month = date.format('M'); // return the month 1, 2, 3.. 12
  
  console.log(date);
  console.log(today_day);
  console.log(today_month);
  
  console.log(`Running [Google Sheets → Select Rows from a Spreadsheet by querying it like a Database]...`);
  result.googlesheets.selectQueryResult = await lib.googlesheets.query['@0.3.0'].select({
      range: `A:C`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [{
          'BirthdayMonth': today_month,
          'BirthdayDay': today_day
      }],
      limit: {
          'count': 0,
          'offset': 0
      }
  });
  console.log(result.googlesheets.selectQueryResult);
  if (result.googlesheets.selectQueryResult.rows.length != 0) {
      let names;
      for (let i = 0; i < result.googlesheets.selectQueryResult.rows.length; i++) {
          if (i == 0) {
              names = result.googlesheets.selectQueryResult.rows[i].fields["Name"];
              console.log(names);
          } else if (i > 0 && i < result.googlesheets.selectQueryResult.rows.length - 1) {
              names = names + ', ' + result.googlesheets.selectQueryResult.rows[i].fields["Name"];
              console.log(names);
          } else {
              names = names + ', и ' + result.googlesheets.selectQueryResult.rows[i].fields["Name"];
              console.log(names);
          }
      }
  
      console.log(`Running [Giphy → Retrieve a random GIF]...`);
      result.giphy.gif = await lib.giphy.random['@0.0.9'].gif({
          tag: `birthday`,
          rating: `g`
      });
  
      console.log(`Running [Slack → Send a Message from your Bot to a Channel]...`);
      result.slack.response = await lib.slack.channels['@0.6.6'].messages.create({
          channel: `#general`,
          text: `Сегодня отмечают День Рождения: ${names}! 🎂 Поздравляем! \n ${result.giphy.gif.url}`
      });
  }
  return result;
};
