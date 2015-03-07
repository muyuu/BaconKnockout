var app = app || {};

(function(w, $, _, ko, app){
    // -------------------------------
    // data binding
    // -------------------------------
    function ViewModel(){
        // repositories binding
        this.repos = ko.observable();
    }

    var viewModel = new ViewModel()
    ko.applyBindings(viewModel);


    // -------------------------------
    // stream
    // -------------------------------

    // make input stream
    var inputStream = $('#query')
        // make steam input event from jquery selctor
        .asEventStream('input')
        // throttle
        .throttle(500)
        // get input text
        .map(function(e){
            return $(e.target).val();
        })
        // ignore same text
        .skipDuplicates();

    // make query stream
    var queryStream = inputStream
        .filter(function(text){
            return text.length > 0;
        })
        .map(function(text){
            return 'https://api.github.com/search/repositories?q=' + text;
        });

    // make repositories stream
    var repositoriesStream = queryStream
        .flatMap(function(query){
            return Bacon.fromPromise($.ajax({ url: query }));
        })
        .map(function(res){
            return res.items;
        });

    // sort stream
    var ascSortStream = $("#ascBtn").asEventStream('click')
        .map(function(){
            var source = viewModel.repos() || [];
            return _.sortBy(source, function(repo){
                return repo.name;
            });
        });

    var descSortStream = $("#descBtn").asEventStream('click')
        .map(function(){
            var source = viewModel.repos() || [];
            return _.sortBy(source, function(repo){
                return repo.name;
            }).reverse();
        });

    // merge sort stream
    var sortStream = ascSortStream.merge(descSortStream);


    // render
    repositoriesStream.onValue(function(repos){
        // knockout binding
        viewModel.repos(repos);
    });

    // render sort
    sortStream.onValue(function(repos){
        viewModel.repos(repos);
    });
})(window, jQuery, _, ko, app);

