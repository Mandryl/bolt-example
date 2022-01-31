const dbUtil = require("../db-util");
const SETTING_TABLE_NAME = "setting";
const REPORT_TABLE_NAME = "report";
const FOLDER_COMPONENT_PATH='./json_compornent'

module.exports.homeView = async(client) =>{
    let homejson = `"type": "home","blocks": [`
    console.log(client);

    //Header Create Json
    let headerjson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/header.json)`));
    // Title Create Json
    let titlejson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/home/title.json`));
    titlejson = titlejson["block_id"].replace("<@UID>",username);
    homejson = homejson + titlejson;
    // Divider Create Json
    let dividerjson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/home/divider.json`));
    homejson =  homejson + dividerjson;
    // placeholder Create Json
    let placeholder = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/home/placeholder.json`));
    homejson = homejson + placeholder
    
    // get setting-reporters
    const repoters  = await findFrom(SETTING_TABLE_NAME, {reporters: userid});
    if (repoters.length < 0) {
        console.log(`There are more than 0 setting)`);
        return homejson;
    }
    forEach((elem,index)=>{

        let teamtitlejson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/home/title.json`));
        teamtitlejson = teamtitlejson["block_id"].replace("@@@NUMBER@@@",String(index + 1))+ ',';
        homejson = homejson + teamtitlejson;
        homejson =  homejson + dividerjson;
        
        let teamtitlejson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/home/teaminfo.json`));
        teamtitlejson = teamtitlejson["block_id"].replace("@@@DATETIME@@@",String(index + 1));
        teamtitlejson = teamtitlejson["block_id"].replace("XXX",elem[""]);
        homejson = homejson + teamtitlejson + ',';
        
        let teambottanjson = JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/home/bottan.json`));
        teambottanjson = teambottanjson.replace('');
        homejson = homejson + teambottanjson+ ',';
        homejson = homejson + placeholder + ',';

        if (surveyObject.length == index + 1){
            homejson =  homejson + dividerjson+ ',';
            surveyjson = rolejson + JSON.stringify(require(`${FOLDER_COMPONENT_PATH}/home/role.json`));
            homejson = homejson + rolejson + ']';;
        }
    })
    //Teams Grid Create Json
    return surveyjson;
}

module.exports.reportModal = async(payload) =>{
    

}
