async function fetchCategories() {
    const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }
        const data = await response.json();
        return data.categories;
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        throw error;
    }
}


async function fetchRecipesByName(name) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }
        const data = await response.json();
        return data.meals;
    } catch (error) {
        console.error('Error al obtener las recetas:', error);
        throw error;
    }
}


async function populateCategories() {
    try {
        const categories = await fetchCategories();
        const categorySelect = document.getElementById('categorySelect');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.strCategory;
            option.textContent = category.strCategory;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al poblar las categorías:', error);
    }
}

function displayRecipes(recipes) {
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'card mb-4';
        card.innerHTML = `
            <img src="${recipe.strMealThumb}" class="card-img-top" alt="${recipe.strMeal}">
            <div class="card-body">
                <h5 class="card-title">${recipe.strMeal}</h5>
                <p class="card-text">${recipe.strInstructions}</p>
            </div>
        `;
        recipesDiv.appendChild(card);
    });
}

document.getElementById('recipeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const categorySelect = document.getElementById('categorySelect');
    const category = categorySelect.value;
    if (category) {
        try {
            const recipes = await fetchRecipesByName(category);
            if (recipes && recipes.length > 0) {
                displayRecipes(recipes);
            } else {
                document.getElementById('recipes').innerHTML = 'No se encontraron recetas.';
            }
        } catch (error) {
            document.getElementById('recipes').innerHTML = 'Error al obtener recetas.';
        }
    } else {
        document.getElementById('recipes').innerHTML = 'Selecciona una categoría.';
    }
});

document.addEventListener('DOMContentLoaded', populateCategories);
