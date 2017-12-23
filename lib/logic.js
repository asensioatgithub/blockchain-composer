

'use strict';
/**
 * Write your transction processor functions here
 */

// /**
//  * Sample invest processor function.
//  * @param {org.acme.model.Invest} invest The sample invest instance.
//  * @transaction
//  */
// function Invest(invest){
        
//     //投资人数已超过限定值，返回
//     if(invest.currentPost.investors.length >= 10)
//         return false;
//     // Get the user participant registry.
//     return getParticipantRegistry('org.acme.model.User')
//         .then(function(panticipantRegeistry){
//             // Process the currentParticipant objects.
//             invest.currentParticipant.token -= 5;
//             invest.currentParticipant.invest.push(invest.currentPost);
//             invest.currentParticipant.reprint.push(invest.currentPost);
//             // Process the owner objects.
//             invest.currentPost.owner.token += 5;
//             // Update the user in the user participant registry.
//             return panticipantRegeistry.updateAll([invest.currentParticipant, invest.currentPost.owner]);      
            
//         })
//         // Get the post asset registry.
//         .then(function(){
//             return getAssetRegiNamespacestry('org.acme.model.Post')
//         })
//         .then(function(assetRegistry){
//             // Process the currentPost objects.
//             invest.currentPost.investors.push(invest.currentParticipant);
//             invest.currentPost.reprinters.push(invest.currentParticipant);
//             invest.currentPost.value += 5;
//             // Update the post in the post asset registry.
//             return assetRegistry.update(invest.currentPost);
//             })
//         .catch(function(error){
//             console.log(error);
//         });
// }


/**
 * Sample Reprint processor function.
 * @param {org.acme.model.Reprint} reprint The sample reprint instance.
 * @transaction
 */

 function Reprint(reprint){
    // Get the user participant registry.
    var count = reprint.currentPost.reprinters.length;
    var ownerProfit = null;
    if(count == 0){
        count ++;
        ownerProfit = 10;
    }
    else {
        ownerProfit = 8;
    }    
    
    var perProfit = 2 / count;
    
    return getParticipantRegistry('org.acme.model.User')
        .then(function(panticipantRegeistry){
            console.log('#### currentParticipant token before: ' + reprint.currentParticipant.token);

            // Process the currentParticipant objects.
            reprint.currentParticipant.token -= 10;
            reprint.currentParticipant.reprint.push(reprint.currentPost);
            panticipantRegeistry.update(reprint.currentParticipant);
            console.log('#### currentParticipant token after: ' + reprint.currentParticipant.token);

            // Process the reprinter objects.
            reprint.currentPost.reprinters.forEach(function(reprinter) {
                console.log('#### reprinter'+ reprinter.email + 'token before: ' + reprinter.token);
                reprinter.token += perProfit;
                panticipantRegeistry.update(reprinter);
                console.log('#### reprinter'+ reprinter.email + 'token after: ' + reprinter.token);
            });
            reprint.currentPost.owner.token += ownerProfit;
            return panticipantRegeistry.update(reprint.currentPost.owner);
        })
        .then(function(){
            return getAssetRegistry('org.acme.model.Post');
        })
        .then(function(assetRegistry){
            reprint.currentPost.reprinters.push(reprint.currentParticipant);
            reprint.currentPost.value += 10;
            return assetRegistry.update(reprint.currentPost);
        })
        .catch(function (error) {
            console.log(error);
        });
 }


/**
 * Sample Reward processor function.
 * @param {org.acme.model.Reward} rw The sample reward instance.
 * @transaction
 */

 function Reward(rw){
    return getParticipantRegistry('org.acme.model.User')
        .then(function(participantRegistry){
            if(participantRegistry.exists(rw.currentPost.owner) && participantRegistry.exists(rw.currentParticipant)){
                rw.currentParticipant.reward.push(rw.currentPost);
                rw.currentPost.owner.token -= 5;
                rw.currentParticipant.token += 5;
                return participantRegistry.updateAll([rw.currentParticipant, rw.currentPost.owner]);    
            }
            else 
                return false;
        })
        .then(function(){
            return getAssetRegistry('org.acme.model.Post');
        })    
        .then(function(assetRegistry){
            rw.currentPost.rewarders.push(rw.currentParticipant);
            rw.currentPost.value += 5;
            return assetRegistry.update(rw.currentPost);
        })
        .catch(function (error) {
            // Add optional error handling here.
            console.log(error);
        });
    
    
 }