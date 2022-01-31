const {homeView,reportModal } = require("../blocks/homeCreate.js");
exports.homeView = async({event,client,logger})=>{
    console.log(client);
    try {
        const result = await client.views.publish({
            user_id: event.user,
            view: await homeView(client)
        });
        logger.info(result);
    } catch (error) {
        logger.error(error);
    }
};

exports.openHomeModal = async({payload,ack, body,view,client, logger})=>{
    await ack();
    console.log(payload);
    try {
        const result = await client.views.open({
            trigger_id: body.trigger_id,
            view: await reportModalJson(payload)
        });
        logger.info(result);
    } catch (error) {
        logger.error(error);
    }
};

