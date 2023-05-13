let pokemon = [];
const numPerPage = 10;
let numPages = 0;
let numPageBtn = 5;


const setup = async () => {

    $('#pokemon').empty();
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=10000')
    pokemon = response.data.results;
    // console.log(pokemon)

    numPages = Math.ceil(pokemon.length / numPerPage);
    
    showPage(1);
    
    // $(".checkbox").on("click", function (e) {
    //     console.log("start")
    //     let listArray = [];
    //     $('.checkbox').each(function() {
    //         cb = $(this);
    //         if (cb.prop('checked')) {
    //             listArray.push(cb.val())
    //         }
    //     });
    //     console.log(listArray)
    // });

    // filter when changes are made
    $('body').on('click', '.checkbox', async function (e) {
        let selectedFilters = [];
        $('.checkbox').filter(':checked').each(function() {
            if (!selectedFilters.hasOwnProperty(this.name)) {
                selectedFilters.push(this.name);
            }
        });
        console.log(selectedFilters);
    });

    

    

    // modal pop up when a button clicked
    $('body').on('click', '.pokeCard', async function (e) {
        const pokemonName = $(this).attr('pokeName')
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        const types = res.data.types.map((type) => type.type.name)
    
        $('.modal-title').html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `)
    
        $('.modal-body').html(`
        <div style="width:200px">
            <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
            <div>
                <h3>Abilities</h3>
                <ul>
                ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
                </ul>
            </div>
            <div>
                <h3>Stats</h3>
                <ul>
                ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                </ul>
            </div>
        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join('')}
          </ul>
        `)
    })

    $('body').on('click', ".pageBtn", async function (e) {
        const pageNum = parseInt($(this).attr('pageNum'))
        showPage(pageNum);
    })

};

async function showPage(currentPage) {
    if (currentPage < 1) {
        currentPage = 1;
    }
    if (currentPage > numPages) {
        currentPage = numPages;
    }

    $('#checkbox-container').empty();
    for (let i = 1; i < 19; i++) {
        let response = await axios.get(`https://pokeapi.co/api/v2/type/${i}`)
        let type = response.data

        $('#checkbox-container').append(`
            <input type="checkbox" class="checkbox" name=${type.name} value=${type.name}>
            <label for=${type.name}>${type.name}</label>
        `)
    }

    $('#pokemon').empty();
    for (let i = ((currentPage -1)*numPerPage); i < ((currentPage-1)*numPerPage) + numPerPage; i++) {
        let innerResponse = await axios.get(`${pokemon[i].url}`);
        let thisPokemon = innerResponse.data;
        $('#pokemon').append(`
        <div class="pokeCard card" pokeName=${thisPokemon.name}>
            <h3>${thisPokemon.name}</h3>
            <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}"/>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal">More</button>
        </div>
        `)
    }

    $('#pagination').empty();
    let startI = Math.max(1, currentPage-Math.floor(numPageBtn/2));
    let endI = Math.min(numPages, currentPage+Math.floor(numPageBtn/2));

    if (currentPage > 1) {
        $('#pagination').append(`
            <button type="button" class="btn btn-primary pageBtn id="pageprev" pageNum="${currentPage-1}">Prev</button>
        `)
    }

    for (let i = startI; i <= endI; i++) {
        let active = "";
        if (i == currentPage) {
            active = "active";
        }
        $('#pagination').append(`
            <button type="button" class="btn btn-primary pageBtn ${active}" id="page${i}" pageNum="${i}">${i}</button>
        `)
    }

    if (currentPage < numPages) {
        $('#pagination').append(`
            <button type="button" class="btn btn-primary pageBtn id="pagenext" pageNum="${currentPage+1}">Next</button>
        `)
    }

}

$(document).ready(setup)


