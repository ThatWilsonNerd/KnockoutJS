requirejs.config({
    paths: {
        jquery: 'jquery-2.1.1.min',
        knockout: 'knockout-3.2.0',
        chartjs: 'Chart.min',
    }
});


require(['knockout','chartjs'], function(ko) {

    function DashboardViewModel() {
        var self = this;
        
        self.rawData = ko.observableArray([
            {label:'grey',color:'#C0C0C0',value:10},
            {label:'black',color:'#000000',value:25},
            {label:'purple',color:'#c8b8c5',value:40}]);

        self.pieChart = {
            title: 'My Chart',
            width: 400,
            height: 500,
            data : self.rawData,
            options: { /*animateRotate:false*/ },
            chart: {},
            click: function(e) {
                var points = self.pieChart.chart.getSegmentsAtEvent(e);
                self.filter(points[0].label);
            }
        };

        //  set up our filter/drill
        self.filter= ko.observable(),
        self.tableData= ko.computed(function() {
            var f = self.filter();
            if(!f) {
                return self.rawData();
            }
            else {
                return ko.utils.arrayFilter(self.rawData(),function(data) {
                    return (f === data.label);
                });
            }
        });
        
        
    };
    
    //  create binding handler for chart
    ko.bindingHandlers.chart = {
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var val = valueAccessor();
            element.width = val.width;
            element.height = val.height;
            var ctx = element.getContext("2d");
            val.chart = new Chart(ctx).Pie(val.data(), val.options);
        }
    }
    
    //  instantiate view model
    ko.applyBindings(new DashboardViewModel());
    
});


