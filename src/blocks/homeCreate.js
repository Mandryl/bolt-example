const getChannelName = require("../listener/channel-util");
const {findFrom} = require("../db-util");
const SETTING_TABLE_NAME = "setting";
const REPORT_TABLE_NAME = "report";
const FOLDER_COMPONENT_PATH='./json_compornent'
const moment = require('moment'); 
const {surveyModalJson} = require("./surveyCreate")

module.exports.homeView = async(payload,context,client,body) =>{
    
    let homejson = `{"type": "home","blocks": [`
    //Header Create Json
    let headerjson = JSON.stringify(require('./json_compornent/header.json'));
    // Title Create Json
    let titlejson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/home/title.json`));
    titlejson = titlejson.replace("USERID",payload["user"]);
    homejson = homejson + titlejson+ ',';
  
    // Divider Create Json
    let dividerjson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/divider.json`));
    homejson =  homejson + dividerjson + ',';
    // placeholder Create Json
    let placeholder = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/placeholder.json`));
    homejson = homejson + placeholder + ',';
    
    let rolejson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/home/role.json`));
  
    // get setting-reporters
    // const repoters  = await findFrom(REPORT_TABLE_NAME, {reporters: payload["user"]});
    const repoters = await findFrom(REPORT_TABLE_NAME, {$or:[{reporters: { $elemMatch : payload["user"]}},{scrummasteruser_id:payload["user"]}]});

    if (repoters.length <= 0) {
        console.log(`There are more than 0 setting`);
        homejson = homejson + placeholder + ',';
        homejson = homejson + rolejson + ']}';
        return homejson;
    }
    
    const channelSet = new Set();
    repoters.forEach((el)=>{
      channelSet.add(el["channel_id"]);
    });

    let datelist = [];
    channelSet.forEach((el)=>{
        let uniqRepoters = repoters.filter((re)=> el== re["channel_id"]);
        const newdateReport = uniqRepoters.reduce((report1,report2)=>(moment(report1["post_date"]).isAfter(report2["post_date"]) ? report1 : report2));
        datelist.push({channel_id:el,date:newdateReport["post_date"]});
    });
    
    let index = 0;
    for(const elem of datelist){
        const getlist = await findFrom(REPORT_TABLE_NAME,{channel_id:elem["channel_id"],post_date:elem["date"]});
        if(getlist.length <= 0){
            break;
        }

        // get channel 
        let teamtitlejson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/home/teamtitle.json`));
        const channelname =  getChannelName(client);
        teamtitlejson = teamtitlejson.replace("CHANNEL", await channelname(elem["channel_id"]));
        homejson = homejson + teamtitlejson+ ',';
        homejson =  homejson + dividerjson+ ',';
      
        // get user display name
        const profile = await client.users.profile.get({
            token:context.botToken,
            user: getlist[0]["scrummasteruser_id"]
        });
        let teamtinfojson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/home/teaminfo.json`));
        teamtinfojson = teamtinfojson.replace("@@@DATETIME@@@", elem["date"]);
        teamtinfojson = teamtinfojson.replace("XXX",profile["profile"]["display_name"]);
        teamtinfojson = teamtinfojson.replace("SCRUMURL",profile["profile"]["image_512"]);
        homejson = homejson + teamtinfojson + ',';
        
        let teambottanjson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/home/teambottan.json`));

        let userindex = getlist[0]["reporters"].indexOf(payload['user']);
        console.log(userindex);
        teambottanjson = teambottanjson.replace("HOME_BLOCKID_HOMEID",String(getlist[0]["mtg_id"])+String(getlist[0][userindex])+String(elem["channel_id"]));
        homejson = homejson + teambottanjson+ ',';
        homejson = homejson + placeholder + ',';
        
        if (datelist.length == index + 1){
            homejson =  homejson + dividerjson+ ',';
            homejson = homejson + rolejson + ']}';
        }
        index = index + 1;
    }
  console.log(homejson);
  console.log(datelist.length)
  return homejson;
}

module.exports.detailModal = async(body) =>{
    const resultjson = surveyModalJson(body["user"]["id"]);
    return resultjson
}

module.exports.reportModal = async(payload,body) =>{
    const repoters  = await findFrom(REPORT_TABLE_NAME, {reporters: { $elemMatch : body["user"]["id"] }});
    let chennelId = ""
    
    if (repoters.length <= 0) {
        console.log(`There are more than 0 setting`);
        return -1;
    }
  
    // get channelid
    for(const elem of repoters){
        if(payload["block_id"].indexOf(elem["channel_id"])){
            chennelId = elem["channel_id"]
            break;
        }        
    }

    // date sort
    const reportObject = await findFrom("survey",{channel_id:chennelId});
    const newdateReport = reportObject.reduce((report1,report2)=>(moment(report1["post_date"]).isAfter(report2["post_date"]) ? report1 : report2));
    console.log(newdateReport);
    
    const newpostdate = await findFrom("survey",{channel_id:chennelId,post_date:newdateReport["post_date"]});
    console.log(newpostdate);

    if (newpostdate.length <= 0) {
        console.log(`There are more than 0 data`);
        return -1;
    }
    
    let index = 0;
    let modalJson = ""
    // modalwindow
    modalJson = `{"type": "modal","title": {"type": "plain_text","text": "Daily Scrum Report","emoji": true},"close": {"type": "plain_text","text": "Close",
		"emoji": true},	"blocks": [`;
    for(const elem of newpostdate){
        let submitPerson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/homemodal/person.json`));
        submitPerson = submitPerson.replace("SLACKNAME",elem["display_name"]);
        submitPerson = submitPerson.replace("DISPLAYNAMEID",elem["display_name"]);
        submitPerson = submitPerson.replace("SLACKURL",elem["profile_url"]);
        modalJson = modalJson + submitPerson + ',';;
      
        // Divider Create Json
        let dividerjson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/divider.json`));
        modalJson =  modalJson + dividerjson + ',';
        
        // Today Create Json
        let reportTodayJson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/homemodal/reporttoday.json`));
        reportTodayJson = reportTodayJson.replace('TODAY_REPORT',elem["report_today"]);
        modalJson = modalJson + reportTodayJson + ',';

        // Report Create Json
        let reportDetailJson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/homemodal/reportdetail.json`));
        reportDetailJson = reportDetailJson.replace('VIEWDETAIL_ID','ACTIONID'+ elem["survey_id"]);
        reportDetailJson = reportDetailJson.replace('EVENT_ID', 'modalbtn_id');
        modalJson = modalJson + reportDetailJson+ ',';
      
        // placeholder Create Json
        let placeholder = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/placeholder.json`));
        modalJson = modalJson + placeholder + ',';
        
        // modal card
        if (newpostdate.length == index + 1){
            modalJson =  modalJson + dividerjson + ']}';;
        }
        index = index + 1;
    }
    console.log(modalJson);
    console.log(newpostdate);
    return modalJson;
}
