
export interface MacroAlgaeInfo {
    name: string;
    place: string;
    country: string;
    type: string;
    properties: string[];
}
export interface MicroAlgaeInfo {
    name: string;
    place: string;
    country: string;
    type: string;
    properties: string[];
}

export interface PopUpData {
    name: string;
    logo: string;
    coords: L.LatLngExpression;
    macroAlgae?: MacroAlgaeInfo[];
    microAlgae?: MicroAlgaeInfo[];
    partnerList: string[];
}

export const PARTNER_LIST: PopUpData[] = [
    {
        name: 'CCMAR',
        logo: 'assets/logos/CCMAR.webp',
        coords: [37.0432, -7.9733],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'IMG',
        logo: 'assets/logos/IMG.webp',
        coords: [50.0125, 14.4649],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'NORD',
        logo: 'assets/logos/NORD.webp',
        coords: [67.2892, 14.3912],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'ESCI',
        logo: 'assets/logos/ESCI.webp',
        coords: [53.1415, 8.2045],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'MIGAL',
        logo: 'assets/logos/MIGAL.webp',
        coords: [33.2064, 35.5711],
        partnerList: ['CCMAR', 'NECTON'],
        macroAlgae: [
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
        coords: [49.1114, -1.0664],
        macroAlgae: [
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
        ],
        microAlgae: [
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
        ],
        partnerList: ['CCMAR', 'NECTON']
    }
    ,
    {
        name: 'BRC',
        logo: 'assets/logos/BRC.webp',
        coords: [46.2486, 20.1471],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'ELOOP',
        logo: 'assets/logos/ELOOP.webp',
        coords: [40.8358, 14.2487],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'IRCCS',
        logo: 'assets/logos/IRCCS.webp',
        coords: [45.5050, 9.2654],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'MBU',
        logo: 'assets/logos/MBU.webp',
        coords: [50.0138, 14.4647],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'NECTON',
        logo: 'assets/logos/NECTON.webp',
        coords: [37.0396, -7.8340],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'SOLARIS',
        logo: 'assets/logos/SOLARIS.webp',
        coords: [45.1950, 10.7954],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'SYNOVO',
        logo: 'assets/logos/SYNOVO.webp',
        coords: [48.5369, 9.0401],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'TEAGASC',
        logo: 'assets/logos/TEAGASC.webp',
        coords: [52.8624, -6.9158],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'UNINA',
        logo: 'assets/logos/UNINA.webp',
        coords: [40.8469, 14.2583],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'VITO',
        logo: 'assets/logos/VITO.webp',
        coords: [51.2185, 5.0906],
        partnerList: ['CCMAR', 'NECTON']
    },
    {
        name: 'YEMOJA',
        logo: 'assets/logos/YEMOJA.webp',
        coords: [33.15, 35.65],
        partnerList: ['CCMAR', 'NECTON']
    }
];