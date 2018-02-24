let wrapper = document.getElementById('wrap');

let sampleData = {
    wrapper,
    columns: ['country', 'area', 'GDP', 'population'],
    rows: [
        {
            country: 'Belarus',
            area: 207600,
            GDP: 52783,
            population: 9491900
        },
        {
            country: 'China',
            area: 9596961,
            GDP: 11937562,
            population: 1389250000
        },
        {
            country: 'Germany',
            area: 357114,
            GDP: 3651871,
            population: 82521653
        },
        {
            country: 'Japan',
            area: 377930,
            GDP: 4884489,
            population: 126590000
        },
        {
            country: 'Russia',
            area: 17098246,
            GDP: 1469341,
            population: 146877088
        },
        {
            country: 'United States',
            area: 9525067,
            GDP: 19362129,
            population: 326632000
        }
    ]
};

let table = new Grid(sampleData);
