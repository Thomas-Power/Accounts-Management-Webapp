var app1 = angular.module("app1", []);

app1.controller("ctrl_home", function($scope){
	$scope.toAccounts = function(){
		$("#home_page").hide();
		$("#accounts_page").show();
	};
	
	$scope.toGenerate = function(){
		$("#home_page").hide();
		$("#generate_page").show();
	};	
	
	$scope.toHoliday = function(){
		$("#home_page").hide();
		$("#holiday_page").show();
	};
});


app1.controller("ctrl_accounts", function($scope){
	$.ajax({
		url: "/Company_List",
	}).then( function(result){
			$scope.companies = result;
			$scope.$apply();			
	});

	$scope.showData = function(){
		$.ajax({
			url: "/data/",
			"data" : {"company" : $scope.company_select}
		}).then( function(result){
			console.log(result)
			$scope.name = result.customer.name;
			$scope.customer_no = result.customer.customer_no
			$scope.address = result.customer.address;
			$scope.orders = result.order
			$scope.$apply();
			$("#company_data").show();
		});
	};
	
	$scope.home = function(){
		$("#home_page").show();
		$("#accounts_page").hide();
	};
});

app1.controller("ctrl_generate", function($scope){
	$scope.home = function(){
		$("#home_page").show();
		$("#generate_page").hide();
	};
	
	$scope.generateInvoices = function(){
		$.ajax({
			type: "POST",
			url: "/generateInvoices",
			data: {
				"month":$scope.month,
				"year":$scope.year
			}
		}).then( function(result){
				$scope.$apply();
		});
	};
	
	$scope.updateDatabase = function(){
		$.ajax({
			type: "POST",
			url: "/updateDatabase",
			data: {
				"month":$scope.month,
				"year":$scope.year
			}
		}).then( function(result){
				$scope.$apply();			
		});
	};
});

app1.controller("ctrl_holiday", function($scope){
	$scope.home = function(){
		$("#home_page").show();
		$("#holiday_page").hide();
	};
	getHolidays = function(){
		$.ajax({
			url: "/holiday",
			type: "GET"
		}).then( function(result){
				console.log(result);
				$scope.holidays = result;
				$scope.$apply();
		});
	};
	getHolidays();
	$scope.addHoliday = function(){
		console.log($scope.holiday);
		$.ajax({
			type: "POST",
			url: "/holiday",
			data: {
				"holiday":$scope.holiday
			}
		}).then( function(result){
				console.log("addHoliday success");
				getHolidays();		
		});
	};
	
	$scope.removeHoliday = function(){
		console.log($scope.holiday);
		$.ajax({
			type: "DELETE",
			url: "/holiday",
			data: {
				"holiday":$scope.holiday
			}
		}).then( function(result){
			console.log("removeHoliday success");
			getHolidays();		
		});
	};
});


