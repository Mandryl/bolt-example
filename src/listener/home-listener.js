const {homeView,reportModal} = require("../blocks/homeCreate.js");
const {surveyModalJson} = require("../blocks/surveyCreate.js");

exports.homeView = async({payload,event,client,logger,context,body})=>{
  console.log(body)
  console.log("----home view-----")
  try {
      let hoge = {
            user_id: event.user,
            view: await homeView(payload,context,client,body)
      }
      // console.log(hoge)
      const result = await client.views.publish(hoge);
        // const result = await client.views.publish({
        //     user_id: event.user,
        //     view: await homeView(payload,context,client)
        // });
      logger.info(result);
    } catch (error) {
        logger.error(error);
    }
};

exports.openHomeModal = async({payload,ack,body,view,client,logger})=>{
    await ack();
    try {
        const result = await client.views.open({
            trigger_id: body.trigger_id,
            view: await reportModal(payload,body)
        });
        logger.info(result);
    } catch (error) {
        logger.error(error);
    }
};

exports.openDetailReportModal = async({payload,ack,body,view,client, logger})=>{
  await ack();
    try {
        const result = await client.views.push({
            trigger_id: body.trigger_id,
            view: await surveyModalJson(payload)
        });
        logger.info(result);
    } catch (error) {
        logger.error(error);
    }
};