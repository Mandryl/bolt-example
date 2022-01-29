const dbUtil = require("../db-util");

module.exports.surveyCreateJson = async() =>{
  const postdate = new Date().toISOString().split('T')[0];
  const surveyObject = await dbUtil.findFrom("survey",{post_date:postdate});
  let surveyjson = '[' +JSON.stringify(require('./json_compornent/survey/header.json')) + ","

	if(surveyObject.length == 0){
		console.log("error");
		return -1;
	}

	surveyObject.forEach((elem,index)=>{
		// Member number
		let reportnumberjson = JSON.stringify(require('./json_compornent/survey/report_section.json'));
		reportnumberjson = reportnumberjson.replace("MEMBER_NUMBER",String(index))+ ',';	
		// Diveider 
		surveyjson = surveyjson +JSON.stringify(require('./json_compornent/survey/divider.json'))+ ',';
		// Slack Client 
		let cliintjson = JSON.stringify(require('./json_compornent/survey/submit_client.json'));
		cliintjson = cliintjson.replace('SLACK_NAME', elem["display_name"]);
		cliintjson = cliintjson.replace('SLACK_NAME_MENTION', elem["display_name"]);
		surveyjson = surveyjson + cliintjson + ',';
		// Section 
		surveyjson = surveyjson + JSON.stringify(require('./json_compornent/survey/submit_section_todays.json')) + ',';
        // report todays
		let reporttext = JSON.stringify(require('./json_compornent/survey/submit_report.json'));
		reporttext  = reporttext.replace('SLACK_REPORT_TEXT', elem["report_today"]);
		surveyjson = surveyjson + reporttext + ',';
		// report action button(modal)
        let actionjson = JSON.stringify(require('./json_compornent/survey/submit_action.json'));
        actionjson = actionjson.replace('ACTIONID', String(index));
        surveyjson = surveyjson + actionjson + ',';
		surveyjson = surveyjson +JSON.stringify(require('./json_compornent/survey/submit_margin.json'))+ ',';
		
		if (surveyObject.length == index + 1){
			surveyjson = surveyjson + JSON.stringify(require('./json_compornent/survey/submit_end.json')) + ']';
      return surveyjson;
		}

	})
	return surveyjson;
}