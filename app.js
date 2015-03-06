var app = app || {};

(function(w, $, _, ko, app){
  // -------------------------------
  // data binding
  // -------------------------------
  function ViewModel (){
    // repositories binding
    this.repos = ko.observable();
  }

  var viewModel = new ViewModel()
  ko.applyBindings(viewModel);



  // -------------------------------
  // stream
  // -------------------------------

  // make input stream
  var inputStream = $('#query').asEventStream('input')
    .map(function(e){
      return $(e.target).val();
    });

  // make query stream
  var queryStream = inputStream
    .throttle(500)
    .filter(function(text){
      return text.length > 0;
    })
    .map(function(text){
      return 'https://api.github.com/search/repositories?q=' + text;
    });

  // make repositories stream
  var repositoriesStream = queryStream
    .flatMap(function(query){
      return Bacon.fromPromise($.ajax({url: query}));
    })
    .map(function(res){
      return res.items;
    });

  // render
  repositoriesStream.onValue(function(repos){
    // knockout binding
    viewModel.repos(repos);
  });
})(window, jQuery, _, ko, app);

