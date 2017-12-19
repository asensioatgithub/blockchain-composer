/**
 * New script file
 */


// /**
//  * Sample transaction processor function.
//  * @param {org.acme.model.Subscribe} subtx The sample transaction instance.
//  * @transaction
//  */

// function Subscribe(subtx) {


// }
/**
 * Sample transaction processor function.
 * @param {org.acme.model.SampleTransaction} tx The sample transaction instance.
 * @transaction
 */
function sampleTransaction(tx) {
    
        // Save the old value of the asset.
        var oldValue = tx.asset.value;
    
        // Update the asset with the new value.
        tx.asset.value = tx.newValue;
    
        // Get the asset registry for the asset.
        return getAssetRegistry('org.acme.model.SampleAsset')
            .then(function (assetRegistry) {
    
                // Update the asset in the asset registry.
                return assetRegistry.update(tx.asset);
    
            })
            .then(function () {
    
                // Emit an event for the modified asset.
                var event = getFactory().newEvent('org.acme.sample', 'SampleEvent');
                event.asset = tx.asset;
                event.oldValue = oldValue;
                event.newValue = tx.newValue;
                emit(event);
    
            });
    
    }