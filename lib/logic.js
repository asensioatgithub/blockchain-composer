'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.acme.model.ChangeAssetValue} changeAssetValue
 * @transaction
 */
function onChangeAssetValue(changeAssetValue) {
    var assetRegistry;
    var id = changeAssetValue.relatedAsset.assetId;
    return getAssetRegistry('org.acme.model.SampleAsset')
        .then(function(ar) {
            assetRegistry = ar;
            return assetRegistry.get(id);
        })
        .then(function(asset) {
            asset.value = changeAssetValue.newValue;
            return assetRegistry.update(asset);
        });
}

/**
 * Sample member processor function.
 * @param {org.acme.model.User} user The sample User instance.
 * @transaction
 */

/* Add the specified participant to this participant registry.
Returns:

Promise - A promise. 
 The promise is resolved when the participant has been added to this participant registry.
 If the participant cannot be added to this participant registry, 
 or if the participant already exists in the participant registry,
 then the promise will be rejected with an error that describes the problem.
*/
function regeisterParticipant(user){
    return getParticipantRegeistry('org.acme.model.User')
        .then(function(participantRegistry){
            // Get the factory for creating new participant instances.
            var factory = getFactory();
            // Create the panticipant
            var newuser = factory.newResource('org.acme.model','User',user.email);
            // Init token 10
            newuser.token = 10;
            newuser.firstName = user.firstName;
            newuser.lastName = user.lastName;
            // Add the newuser to the driver participant registry.
            return participantRegistry.add(newuser);
        })
        .catch(function (error){
            console.log(error);
        });
}

/*
Determines whether a specific participant exists in this participant registry.
Returns

Promise - A promise. 
    The promise is resolved with a boolean which is true 
    if the specified participant exists in this participant registry, 
    and false if the specified participant does not exist.
*/    
function existsMember(email){  
    return getParticipantRegeistry('org.acme.model.User')
        .then(function(participantRegistry){
            return participantRegistry.exists(email);
        })
        .then(function(exists){
            console.log('Member exists', exists);
        })
        .catch(function (error){
            console.log(error);
        })
}

/**
 * Sample post processor function.
 * @param {org.acme.model.Post} post The sample Post instance.
 * @transaction
 */
function regeisterAsset(post){
    var currentParticipant = getCurrentParticipant();
    return getAssetRegistry('org.acme.model.Post')
        .then(function(assetRegistry){
            var factory = getFactory();
            var newpost = factory.newResource('org.acme.model','Post',post.postKey)
            newpost.value = 0;
            newpost.postTimestamp = post.postTimestamp;
            newpost.owner = currentParticipant;
            newpost.forwarder = ;
            return assetRegistry.add(newpost);
        })
        .catch(function (error){
            console.log(error);
        });
}


/**
 * Sample Forward processor function.
 * @param {org.acme.model.Forward} fw The sample Forward instance.
 * @transaction
 */

 function Forward(fw) {
     var token = fw.token;
     var currentParticipant = getCurrentParticipant();
     return getAssetRegistry('org.acme.model.Post')
        .then(function (assetRegistry){
            return assetRegistry.get(fw.postKey);
        })
        .then(function (post){
            post.value += 1;
            post.owner.token = token * 0.8;
            var count = post.forwarders.length;
            var tokenLeft = token * 0.2;
            var offest = tokenLeft/count;
            // Modify the token of each forwarder.
            post.forwarders.forEach(function(forwarder){
                forwarder.token += offest;
                participantRegistry.update(forwarder);
            })
            post.forwarders.push(currentParticipant.email);
            //update value of this post
            return assetRegistry.update(post);
        })
        .catch(function (error){
            console.log(error);
        });
        
 }