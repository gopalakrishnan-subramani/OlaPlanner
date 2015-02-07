angular.module('starter.database', [])
.service('DataStore', function ($http, $q) {
        
        //Model Class, don't disturb now 
        var Plan = Parse.Object.extend("Plan");

        // A Collection containing all instances of Plan.
        var PlanCollection = Parse.Collection.extend({
          model: Plan
        });


        //Model Class, don't disturb now 
        var Trip = Parse.Object.extend("Trip");

                // A Collection containing all instances of Trip.
        var TripCollection = Parse.Collection.extend({
          model: Trip
        });

        //use collect.get('id') or collection.at(index) or collection.each(function(item))


        console.info("In LiveStream service");

        this.newTrip = function() {
          return new Trip();
        }

        this.getTrips = function(planId) {
          var deferred = $q.defer();
          //FIXME: Add planId for filtering
          var collection = new TripCollection();
                collection.fetch({
                  success: function(collection) {
                     return deferred.resolve(collection);
                  },
                  error: function(collection, error) {
                    // The collection could not be retrieved.
                    return deferred.reject(error);
                  }
            });

          return deferred.promise;
        };


        this.getTrip = function(id){
            var deferred = $q.defer();

            var query = new Parse.Query(Trip);

            query.get(id, {
                  success: function(plan) {
                    alert('got the document ' + plan.get('source') + ' ' + plan.get('destination'));

                    // The object was retrieved successfully.
                    return deferred.resolve(plan);
                  },
                  error: function(object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                     return deferred.reject(error);
                  }
            });
           return deferred.promise;
      };


        this.newPlan = function() {
          return new Plan();
        };

        this.getPlans = function () {
          var deferred = $q.defer();
             var collection = new PlanCollection();

             
                collection.fetch({
                  success: function(collection) {
                    
                     return deferred.resolve(collection);

                  },
                  error: function(collection, error) {
                    // The collection could not be retrieved.
                    return deferred.reject(error);
                  }
            });

          return deferred.promise;
        };

        this.getPlan = function(id){
            var deferred = $q.defer();

            var query = new Parse.Query(Plan);

            query.get(id, {
                  success: function(plan) {
                    alert('got the document ' + plan.get('source') + ' ' + plan.get('destination'));

                    // The object was retrieved successfully.
                    return deferred.resolve(plan);
                  },
                  error: function(object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                     return deferred.reject(error);
                  }
            });
           return deferred.promise;
      };
});

/*
//create new plan

var plan = new DataStore.newPlan();
         

        plan.set("source", "Bangalore1");
        plan.set("destination", "Mysore1");
         
         
        plan.save(null, {
          success: function(plan) {
            // Execute any logic that should take place after the object is saved.
            alert('New plan created with objectId at controller: ' + plan.id);
                 
          },
          error: function(plan, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
          }
        });

//get all plans
 DataStore.getPlans().then(function(plans){
        plans.each(function(plan){
          console.log(plan.get('source'));
        });
      });
    // Create a new instance of that class.
        

//Get Specific Plan
    DataStore.getPlan("C1wwO7sWGb").then(function (plan) {

    },
    function(err) {
      alert("Error " + err);
    }
    );
*/

