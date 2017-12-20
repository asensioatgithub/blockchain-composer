/**
 * New script file
 */



/**
 * Sample member processor function.
 * @param {org.acme.model.Member} mb The sample member instance.
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
function addMember(mb){
    return getParticipantRegeistry('org.acme.model.Member')
        .then(function(participantRegistry){
            // Get the factory for creating new participant instances.
            var factory = getFactory();
            // Create the member
            var member = factory.newResource('org.acme.model','Member',mb.memberId);
            // Init token 10
            member.token = 10;
            member.firstName = mb.firstName;
            member.lastName = mb.lastName;
            // Add the driver to the driver participant registry.
            return participantRegistry.add(member);
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
function existsMember(memberId){  
    return getParticipantRegeistry('org.acme.model.Member')
        .then(function(participantRegistry){
            return participantRegistry.exists(memberID);
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
 * @param {org.acme.model.Post} post The sample post instance.
 * @transaction
 */
