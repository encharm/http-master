module.exports = function LetsEncryptService(commService) {
  console.log("SERVICE!!");
    
  return;
  var LE = require('letsencrypt');

  var config = {
  , server: LE.stagingServerUrl                               // or LE.productionServerUrl
  , configDir: require('homedir')() + '/letsencrypt/etc'      // or /etc/letsencrypt or wherever
  , privkeyPath: ':config/live/:hostname/privkey.pem'         //
  , fullchainPath: ':config/live/:hostname/fullchain.pem'     // Note: both that :config and :hostname
  , certPath: ':config/live/:hostname/cert.pem'               //       will be templated as expected
  , chainPath: ':config/live/:hostname/chain.pem'             //
  , debug: false
  };


  var handlers = {
    setChallenge: function (opts, hostname, key, val, cb) {}  // called during the ACME server handshake, before validation
  , removeChallenge: function (opts, hostname, key, cb) {}    // called after validation on both success and failure
  , getChallenge: function (opts, hostname, key, cb) {}       // this is special because it is called by the webserver
                                                              // (see letsencrypt-cli/bin & letsencrypt-express/standalone),
                                                              // not by the library itself

  , agreeToTerms: function (tosUrl, cb) {}                    // gives you an async way to expose the legal agreement
                                                              // (terms of use) to your users before accepting
  };


  var le = LE.create(config, handlers);

                                                                // checks :conf/renewal/:hostname.conf
  le.register({                                                 // and either renews or registers

    domains: ['example.com']                                    // CHANGE TO YOUR DOMAIN
  , email: 'user@email.com'                                     // CHANGE TO YOUR EMAIL
  , agreeTos: false                                             // set to true to automatically accept an agreement
                                                                // which you have pre-approved (not recommended)
  }, function (err) {

    if (err) {
      // Note: you must have a webserver running
      // and expose handlers.getChallenge to it
      // in order to pass validation
      // See letsencrypt-cli and or letsencrypt-express
      console.error('[Error]: node-letsencrypt/examples/standalone');
      console.error(err.stack);
    } else {
      console.log('success');
    }
  });
  
}
