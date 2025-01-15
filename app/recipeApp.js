let recipeObject

let recipes = []; 

async function getData() {
    const response = await fetch(
        "https://raw.githubusercontent.com/jianxinz233/jianxinz233.github.io/refs/heads/main/data/recipe_app_data.json"
    );
    recipes  = await response.json();
    showAllRecipes();
}

getData();

function showAllRecipes(){
    const recipeItemElement = document.getElementById("saved-recipes");
    recipeItemElement.innerHTML = "";

    recipes.forEach(recipe => {
        showRecipe(recipe);
    });
}

resetForm();

function addRecipe(event){
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    if (title === "") {
        alert("Please enter a title!")
        return;
    }

    const picture_url = document.getElementById('image-link').value.trim();
    if (picture_url === "") {
        alert("Please enter a pictural URL!")
        return;
    }

    const ingredients = [];
    const ingredientNames = document.querySelectorAll("input[name='ingredient_name']");
    const ingredientAmounts = document.querySelectorAll("input[name='ingredient_amount']");
    for(let i = 0; i < ingredientNames.length; i++) {
        const name = ingredientNames[i].value;
        const amount = ingredientAmounts[i].value;

        if (name === "" || amount === "") {
            alert("Please enter ingredients and amount!")
            return;
        };
    
        if (isNaN(amount) || Number(amount) <= 0) {
            alert("Please enter a valid number for ingredient amounts.");
            return;
        };

        ingredients.push({name: name, amount: amount});
    };

    const description = document.getElementById('description').value.trim();
    if (description === "") {
        alert("Please enter a description!")
        return;
    }

    const newRecipe = {
        id: recipes.length + 1,
        title,
        picture_url,
        ingredients,
        description
    };

    recipes.push(newRecipe);
    showAllRecipes();

    resetForm()
    
};

function resetForm() {
    document.getElementById("recipe-form").reset();

    const ingredientContainer = document.getElementById("containerForIngredient");
    ingredientContainer.innerHTML = ''; 

    for (let i =0; i < 5; i++) {
        const ingredientRow = document.createElement("div");
        ingredientRow.classList.add("ingredient-item");

        const ingredientNameInput = document.createElement("input");
        ingredientNameInput.type = "text";
        ingredientNameInput.name = "ingredient_name";
        ingredientNameInput.placeholder = "Ingredient Name";
        ingredientNameInput.required = true;

        const ingredientAmountInput = document.createElement("input");
        ingredientAmountInput.type = "number";
        ingredientAmountInput.name = "ingredient_amount";
        ingredientAmountInput.placeholder = "Amount";
        ingredientAmountInput.required = true;

        ingredientRow.appendChild(ingredientNameInput);
        ingredientRow.appendChild(ingredientAmountInput);
        ingredientContainer.appendChild(ingredientRow);
    }
}

function addMoreIngredient(event){
    event.preventDefault();

    const moreIngredientElement = document.getElementById("containerForIngredient");

    const moreIngredientToAdd = document.createElement("div");
    moreIngredientToAdd.classList.add("ingredient-item");
    

    const moreIngredientName = document.createElement("input");
    moreIngredientName.setAttribute("name", "ingredient_name");
    moreIngredientName.type = "text";
    moreIngredientName.placeholder = "Ingredient Name";
    moreIngredientToAdd.appendChild(moreIngredientName);

    const moreIngredientAmount = document.createElement("input");
    moreIngredientAmount.setAttribute("name", "ingredient_amount");
    moreIngredientAmount.type = "number";
    moreIngredientAmount.placeholder = "Amount";
    moreIngredientToAdd.appendChild(moreIngredientAmount);

    moreIngredientElement.appendChild(moreIngredientToAdd)
}



const addIngredientButton = document.getElementById('add-ingredient')
addIngredientButton.addEventListener('click', addMoreIngredient);


const addRecipeButton = document.getElementById('add-recipe')
addRecipeButton.addEventListener('click', addRecipe);

function searchRecipes() {
    const searchKeyword = document.getElementById('search-input').value.toLowerCase();
    const filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchKeyword) ||
        recipe.description.toLowerCase().includes(searchKeyword) ||
        recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(searchKeyword))
    );
    
    const recipeItemElement = document.getElementById("saved-recipes");
    recipeItemElement.innerHTML = "";

    if (searchKeyword === "") {
        recipes.forEach(recipe => {
            showRecipe(recipe)
        });
        return;
    }

    if (filteredRecipes.length === 0) {
        const noMatchElement = document.createElement('div');
        noMatchElement.textContent = "No Match Result Found.";
        recipeItemElement.appendChild(noMatchElement);
    } else {
        filteredRecipes.forEach(recipe => {
            const recipeContainer = document.createElement("div");
            recipeContainer.classList.add("recipe-item");
    
            const recipeTitle = document.createElement("h3");
            recipeTitle.textContent = recipe.title;
            recipeContainer.appendChild(recipeTitle);
    
            const recipeImage = document.createElement("img");
            recipeImage.src = recipe.picture_url;
            recipeImage.alt = `${recipe.title}-img`;
            recipeContainer.appendChild(recipeImage);
    
            const matchingIngredients = recipe.ingredients.filter(ingredient =>
                ingredient.name.toLowerCase().includes(searchKeyword)
            );
    
            if (matchingIngredients.length > 0) {
                const matchingIngredientsHeader = document.createElement("h4");
                matchingIngredientsHeader.textContent = "Matching Ingredients:";
                recipeContainer.appendChild(matchingIngredientsHeader);
    
                const matchingIngredientsList = document.createElement("ul");
                matchingIngredients.forEach(ingredient => {
                    const ingredientItem = document.createElement("li");
                    ingredientItem.textContent = `${ingredient.name}: ${ingredient.amount} - ${ingredient.price} kr.`;
                    matchingIngredientsList.appendChild(ingredientItem);
                });
                recipeContainer.appendChild(matchingIngredientsList);
            }
    
            recipeItemElement.appendChild(recipeContainer);
        });
    }
}

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', searchRecipes);


let sortDescending = true;

function sortRecipesByIngredients() {
    if(sortDescending) {
        recipes.sort((a, b) => b.ingredients.length - a.ingredients.length);
        document.getElementById('sort-recipes').textContent = "Sort: Increasing Ingredient";
    } else {
        recipes.sort((a, b) => a.ingredients.length - b.ingredients.length);
        document.getElementById('sort-recipes').textContent = "Sort: Decreasing Ingredients";
    }
    sortDescending = !sortDescending;
    showAllRecipes(); 
}

const sortRecipesButton = document.getElementById('sort-recipes');
sortRecipesButton.addEventListener('click', sortRecipesByIngredients);

const setTimerButton = document.getElementById("start-timer");
setTimerButton.addEventListener('click', setTimer);
const timerDisplay = document.getElementById("timer-display");

let timerInterval

function setTimer() {
    const timerInput = parseInt(document.getElementById('timer-input').value);
    if (timerInput <= 0 || isNaN(timerInput)) {
        alert("Please enter a valid Timer.");
        return;
    }
    
    let timeRemaining = timerInput * 60;

    updateDisplay(timeRemaining);

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {timeRemaining--;

        if (timeRemaining <=0) {
            clearInterval(timerInterval);
            alert("Time's up!");
            document.getElementById("timer-input").value = "";
        } else {
            updateDisplay(timeRemaining);
        }
    },1000);
}

function updateDisplay(timerSeconds) {
    const minutes = Math.floor(timerSeconds / 60);
    const remainingSeconds = timerSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2,"0")}:${String(remainingSeconds).padStart(2,"0")}`;
}

const resetTimerButton = document.getElementById("reset-timer");
resetTimerButton.addEventListener("click", resetTimer);

function resetTimer() {
    clearInterval(timerInterval);
    timerDisplay.textContent = "00:00";
    document.getElementById("timer-input").value = "";
}

const timeSpentDisplay = document.getElementById("time-spent");
let totalSecondsSpent = 0;

function updateTimer() {
    totalSecondsSpent++;
    timeSpentDisplay.textContent = formatTime(totalSecondsSpent);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minutes ${remainingSeconds} seconds`;
}

window.onload = function () {
    setInterval(updateTimer, 1000);
};

function showRecipe(recipe){
    const recipeItemElement = document.getElementById('saved-recipes');

    const recipeContainer = document.createElement("div");
    recipeContainer.classList.add("recipe-item");
    
    const recipeTitle = document.createElement("h3");
    recipeTitle.textContent = recipe.title;
    recipeContainer.appendChild(recipeTitle);

    const recipeImage = document.createElement("img");
    recipeImage.src = recipe.picture_url;
    recipeImage.alt = `${recipe.title}-img`;
    recipeContainer.appendChild(recipeImage);

    const recipeIngredientsHeader = document.createElement("h4")
    recipeIngredientsHeader.textContent = "Ingredients:";
    recipeContainer.appendChild(recipeIngredientsHeader);

    const recipeIngredientsList = document.createElement("ul");
    for(let ingredient of recipe.ingredients) {
        const ingredientItem = document.createElement("li");
        ingredientItem.textContent = `${ingredient.name} ${ingredient.amount}`;
        recipeIngredientsList.appendChild(ingredientItem);
    }
    recipeContainer.appendChild(recipeIngredientsList);

    const recipeDescription = document.createElement("p");
    recipeDescription.textContent = recipe.description;
    recipeContainer.appendChild(recipeDescription);

    
    recipeItemElement.appendChild(recipeContainer)
}

showAllRecipes();

