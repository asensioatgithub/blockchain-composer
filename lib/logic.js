'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample invest processor function.
 * @param {org.acme.model.Invest} invest The sample invest instance.
 * @transaction
 */
function Invest(invest){
        
    //投资人数已超过限定值，返回
    if(invest.currentPost.investors.length >= 10)
        return false;
    // Get the user participant registry.
    return getParticipantRegistry('org.acme.model.User')
        .then(function(panticipantRegeistry){
            // Process the currentParticipant objects.
            invest.currentParticipant.token -= 5;
            invest.currentParticipant.invest.push(invest.currentPost);
            invest.currentParticipant.reprint.push(invest.currentPost);
            // Process the owner objects.
            invest.currentPost.owner.token += 5;
            // Update the user in the user participant registry.
            return panticipantRegeistry.updateAll([invest.currentParticipant, invest.currentPost.owner]);      
        })
        // Get the post asset registry.
        .then(function(){
            return getAssetRegistry('org.acme.model.Post')
        })
        .then(function(assetRegistry){
            // Process the currentPost objects.
            invest.currentPost.investors.push(invest.currentParticipant);
            invest.currentPost.reprinters.push(invest.currentParticipant);
            invest.currentPost.value += 5;
            // Update the post in the post asset registry.
            return assetRegistry.update(invest.currentPost);
            })
        .catch(function(error){
            console.log(error);
        });
}


/**
 * Sample Reprint processor function.
 * @param {org.acme.model.Reprint} reprint The sample reprint instance.
 * @transaction
 */

 function Reprint(reprint){
    // Get the user participant registry.
    var count = reprint.currentPost.investors.length;
    var ownerProfit = reprint.currentPost.value * 0.8;
    var perProfit = (reprint.currentPost.value - ownerProfit) / count;

    return getParticipantRegistry('org.acme.model.User')
        .then(function(panticipantRegeistry){
            console.log('#### currentParticipant token before: ' + reprint.currentParticipant.token);
            // Process the currentParticipant objects.
            reprint.currentParticipant.token -= reprint.currentPost.value;
            reprint.currentParticipant.reprint.push(reprint.currentPost);
            console.log('#### currentParticipant token after: ' + reprint.currentParticipant.token);
            // Process the currentParticipant objects.
            reprint.currentPost.investors.forEach(function(investor) {
                console.log('#### investor'+ investor.email + 'token before: ' + investor.token);
                investor.token += perProfit;
                panticipantRegeistry.update(investor);
                console.log('#### investor'+ investor.email + 'token after: ' + investor.token);
            });
            return panticipantRegeistry.update(reprint.currentParticipant);
        })
        .catch(function (error) {
            console.log(error);
        });
 }
