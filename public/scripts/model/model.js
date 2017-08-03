'use strict';
var app = app || {};

(function(module) {

  Recipe.all = [];

  function Recipe(object){
    this.uri = object.uri;
    this.name = object.label;
    this.image = object.image;
    this.servingCount = object.yield;
    this.calorieCount = Math.round(object.calories);
    this.caloriePer = Math.round(object.calories / object.yield);
    this.recipeLink = object.url;
    this.ingredients = Recipe.buildIngredientsList(object.ingredientLines);
    if (object.totalNutrients.CHOCDF){
      this.carbCount = object.totalNutrients.CHOCDF.quantity + ' ' + object.totalNutrients.CHOCDF.unit;
    } else {
      this.carbCount = 'Not Available';
    }
    if (object.totalNutrients.PROCNT){
      this.protein = object.totalNutrients.PROCNT.quantity + ' ' + object.totalNutrients.PROCNT.unit;
    } else {
      this.protein = 'Not Available';
    }
    if (object.totalNutrients.FAT){
      this.fat = object.totalNutrients.FAT.quantity + ' ' + object.totalNutrients.FAT.unit;
    } else {
      this.fat = 'Not Available';
    }
  }

  Recipe.fetchRecipes = function(){
    var recipeResults;
    $.getJSON('../assets/starterRecipes.json',function(data){
      recipeResults = data;
    }).then(function(){
      Recipe.initRecipes(recipeResults,'section#home #recipes');
    });
  };

  Recipe.getSavedRecipies = function(){
    $('section#home #recipes').empty();
    $.get(`/saved_recipes/${window.localStorage.userName}`)
      .then(
        results => {
          let savedRecipes = results.map( (item) =>{
            return JSON.parse(item.body);
          });
          console.log(savedRecipes);
          savedRecipes.forEach(function(item){
            $('section#home #recipes').append(Recipe.toHtml(item));
          });
        }
      );
  };

  Recipe.saveRecipe = (bodyString) => {
    $.post('/saved_recipes', {user_name: window.localStorage.userName, body: bodyString});
  };

 //returns ingredients as a list of <li> elements to append with the tmplate
  Recipe.buildIngredientsList = function(ingredients){
    var allIngredients = ingredients.map(function(item){
      return '<li>' + item + '</li>';
    }).reduce(function(acc,val){
      return acc += val;
    });
    return allIngredients;
  };

  Recipe.loadRecipes = function(recipeResults){
    Recipe.all = recipeResults.map(function(item){
      return new Recipe(item);
    });
  };

  Recipe.toHtml = function(recipe){
    var template = Handlebars.compile($('#recipe-template').html());
    return template(recipe);
  };

  Recipe.currentRecipe = 0;
//use this function to adds a recipe to the page
  Recipe.initRecipes = function(recipes,location){
    Recipe.loadRecipes(recipes);
    $(location).empty();
    var onHome = location.search('#home');
    if (localStorage.userName && onHome > -1){
      $('#home .hrTry span').text('Your Saved Recipes');
      Recipe.all.forEach(function(item){
        $(location).append(Recipe.toHtml(item));
      });
    } else {
      Recipe.initRecipe = Recipe.all[0];
      $(location).append(Recipe.toHtml(Recipe.all[0]));
    }
  };

  Recipe.getNextRecipe = (e,location) => {
    Recipe.currentRecipe++;
    $(e.target).closest('div').empty();
    $(location).append(Recipe.toHtml(Recipe.all[Recipe.currentRecipe % Recipe.all.length]));
  };

  Recipe.getPreviousRecipe = function(){
    Recipe.currentRecipe--;
    $(e.target).closest('div').empty();
    $(location).append(Recipe.toHtml(Recipe.all[Recipe.currentRecipe]));
  };

  Recipe.deleteRecipe = function(){

  };

  Recipe.saveRecipe = function(){

  };

  module.Recipe = Recipe;
})(app);
