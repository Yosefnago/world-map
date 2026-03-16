
export interface AlgaeData {
    name: string;
    scientificName: string;
    type: string;
    properties: string[];
    coords: L.LatLngExpression;
}
export interface PartnerData {
    name: string;
    logo: string;
    url: string;
    coords: L.LatLngExpression;
}
export const ALGAE_LIST: AlgaeData[] = [
    {
        name: 'Nori',
        scientificName: 'Porphyra',
        type: 'Red Algae',
        coords: [35.15, 139.85],
        properties: [
            'High protein, Vitamins A, B12, C.',
            'Thin, papery, becomes chewy when hydrated.',
            'Wrapping sushi rolls.'
        ]
    },
    {
        name: 'Kombu',
        scientificName: 'Laminaria',
        type: 'Brown Algae (Kelp family)',
        coords: [43.06, 141.35],
        properties: [
            'Extremely high in glutamic acid (strong Umami taste).',
            'Grows in large underwater "forests" in cold ocean waters.',
            'Primarily used for Dashi (soup stock).'
        ]
    }
];
export const PARTNER_LIST: PartnerData[] = [
    {
        name: 'Partner 1',
        logo: 'assets/logos/CCMAR.png',
        url: 'https://ccmar.ualg.pt/',
        coords: [37.0432, -7.9733]
    },
    {
        name: 'Partner 2',
        logo: 'assets/logos/IMG.png',
        url: 'https://www.openscreen.cz/',
        coords: [50.0125, 14.4649]
    },
    {
        name: 'Partner 3',
        logo: 'assets/logos/NORD.png',
        url: 'https://www.nord.no/',
        coords: [67.2892, 14.3912]
    },
    {
        name: 'Partner 4',
        logo: 'assets/logos/ESCI.png',
        url: 'https://www.esci.eu/',
        coords: [53.1415, 8.2045]
    },
    {
        name: 'Partner 5',
        logo: 'assets/logos/MIGAL.png',
        url: 'https://www.migal.org.il/en',
        coords: [33.2064, 35.5711]
    },
    {
        name: 'Partner 6',
        logo: 'assets/logos/ALGAIA.png',
        url: 'https://www.algaia.com/en/',
        coords: [49.1114, -1.0664]
    },
    {
        name: 'Partner 7',
        logo: 'assets/logos/BRC.png',
        url: 'https://www.brc.hu/en',
        coords: [46.2486, 20.1471]
    },
    {
        name: 'Partner 8',
        logo: 'assets/logos/ELOOP.png',
        url: 'https://www.eloop.it/',
        coords: [40.8358, 14.2487]
    },
    {
        name: 'Partner 9',
        logo: 'assets/logos/IRCCS.png',
        url: 'https://www.hsr.it/',
        coords: [45.5050, 9.2654]
    },
    {
        name: 'Partner 10',
        logo: 'assets/logos/MBU.png',
        url: 'https://mbu.cas.cz/en',
        coords: [50.0138, 14.4647]
    },
    {
        name: 'Partner 11',
        logo: 'assets/logos/NECTON.png',
        url: 'https://phytobloom.com/',
        coords: [37.0396, -7.8340]
    },
    {
        name: 'Partner 12',
        logo: 'assets/logos/SOLARIS.png',
        url: 'https://www.solarisbiotech.com/en/bioreactors-fermentors',
        coords: [45.1950, 10.7954]
    },
    {
        name: 'Partner 13',
        logo: 'assets/logos/SYNOVO.png',
        url: 'https://synovo.com/',
        coords: [48.5369, 9.0401]
    },
    {
        name: 'Partner 14',
        logo: 'assets/logos/TEAGASC.png',
        url: 'https://teagasc.ie/',
        coords: [52.8624, -6.9158]
    },
    {
        name: 'Partner 15',
        logo: 'assets/logos/UNINA.png',
        url: 'https://www.unina.it/it/',
        coords: [40.8469, 14.2583]
    },
    {
        name: 'Partner 16',
        logo: 'assets/logos/VITO.png',
        url: 'https://vito.be/nl',
        coords: [51.2185, 5.0906]
    },
    {
        name: 'Partner 17',
        logo: 'assets/logos/YEMOJA.jpg',
        url: '',
        coords: [33.0076, 35.0924]
    }
];