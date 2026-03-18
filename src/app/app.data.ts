
export interface AlgaeInfo {
    name: string;
    place: string;
    country: string;
    type: string;
    properties: string[];
}

export interface PartnerData {
    name: string;
    logo: string;
    url: string;
    coords: L.LatLngExpression;
    algaeInfo?: AlgaeInfo[];
}

export const PARTNER_LIST: PartnerData[] = [
    {
        name: 'CCMAR',
        logo: 'assets/logos/CCMAR.webp',
        url: 'https://ccmar.ualg.pt/',
        coords: [37.0432, -7.9733]
    },
    {
        name: 'IMG',
        logo: 'assets/logos/IMG.webp',
        url: 'https://www.openscreen.cz/',
        coords: [50.0125, 14.4649]
    },
    {
        name: 'NORD',
        logo: 'assets/logos/NORD.webp',
        url: 'https://www.nord.no/',
        coords: [67.2892, 14.3912]
    },
    {
        name: 'ESCI',
        logo: 'assets/logos/ESCI.webp',
        url: 'https://www.esci.eu/',
        coords: [53.1415, 8.2045]
    },
    {
        name: 'MIGAL',
        logo: 'assets/logos/MIGAL.webp',
        url: 'https://www.migal.org.il/en',
        coords: [33.2064, 35.5711],
        algaeInfo: [
            {
                name: 'Nori',
                place: 'Porphyra',
                country: 'Red Algae',
                type: 'red',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ]
            }
        ]
    },
    {
        name: 'Algaia',
        logo: 'assets/logos/AscophyllumNodosum.jpg',
        url: 'https://www.algaia.com/en/',
        coords: [49.1114, -1.0664],
        algaeInfo: [
            {
                name: 'Ascophyllum nodosum',
                place: 'Brittany',
                country: 'France',
                type: 'MacroAlgae',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ]
            },
            {
                name: 'Saccharina latissima',
                place: 'Brittany',
                country: 'France',
                type: 'MacroAlgae',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ]
            },
            {
                name: 'Palmaria palmata',
                place: 'Brittany',
                country: 'France',
                type: 'MacroAlgae',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ]
            },
            {
                name: 'Grateloupia turuturu',
                place: 'Brittany',
                country: 'France',
                type: 'MacroAlgae',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ]
            },
            {
                name: 'Gelidium madagascariense',
                place: 'Madagascar',
                country: 'Madagascar',
                type: 'MacroAlgae',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ]
            },
            {
                name: 'Macricystis pyrifera',
                place: 'Eastern Pacific',
                country: 'Eastern Pacific',
                type: 'MacroAlgae',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ]
            }
        ]
    }
    ,
    {
        name: 'BRC',
        logo: 'assets/logos/BRC.webp',
        url: 'https://www.brc.hu/en',
        coords: [46.2486, 20.1471]
    },
    {
        name: 'ELOOP',
        logo: 'assets/logos/ELOOP.webp',
        url: 'https://www.eloop.it/',
        coords: [40.8358, 14.2487]
    },
    {
        name: 'IRCCS',
        logo: 'assets/logos/IRCCS.webp',
        url: 'https://www.hsr.it/',
        coords: [45.5050, 9.2654]
    },
    {
        name: 'MBU',
        logo: 'assets/logos/MBU.webp',
        url: 'https://mbu.cas.cz/en',
        coords: [50.0138, 14.4647]
    },
    {
        name: 'NECTON',
        logo: 'assets/logos/NECTON.webp',
        url: 'https://phytobloom.com/',
        coords: [37.0396, -7.8340]
    },
    {
        name: 'SOLARIS',
        logo: 'assets/logos/SOLARIS.webp',
        url: 'https://www.solarisbiotech.com/en/bioreactors-fermentors',
        coords: [45.1950, 10.7954]
    },
    {
        name: 'SYNOVO',
        logo: 'assets/logos/SYNOVO.webp',
        url: 'https://synovo.com/',
        coords: [48.5369, 9.0401]
    },
    {
        name: 'TEAGASC',
        logo: 'assets/logos/TEAGASC.webp',
        url: 'https://teagasc.ie/',
        coords: [52.8624, -6.9158]
    },
    {
        name: 'UNINA',
        logo: 'assets/logos/UNINA.webp',
        url: 'https://www.unina.it/it/',
        coords: [40.8469, 14.2583]
    },
    {
        name: 'VITO',
        logo: 'assets/logos/VITO.webp',
        url: 'https://vito.be/nl',
        coords: [51.2185, 5.0906]
    },
    {
        name: 'YEMOJA',
        logo: 'assets/logos/YEMOJA.webp',
        url: '',
        coords: [33.15, 35.65]
    }
];