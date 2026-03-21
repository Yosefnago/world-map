
export interface MacroAlgaeInfo {
    name: string;
    logo: string;
    place: string;
    country: string;
    type: string;
    properties: string[];
    partnerList: string[];

}
export interface MicroAlgaeInfo {
    name: string;
    logo: string;
    place: string;
    country: string;
    type: string;
    properties: string[];
    partnerList: string[];
}

export interface PopUpData {
    name: string;
    coords: L.LatLngExpression;
    macroAlgae?: MacroAlgaeInfo[];
    microAlgae?: MicroAlgaeInfo[];
}

export const PARTNER_LIST: PopUpData[] = [
    {
        name: 'CCMAR',
        coords: [37.0432, -7.9733]
    },
    {
        name: 'IMG',
        coords: [50.0125, 14.4649]
    },
    {
        name: 'NORD',
        coords: [67.2892, 14.3912]
    },
    {
        name: 'ESCI',
        coords: [53.1415, 8.2045]
    },
    {
        name: 'MIGAL',
        coords: [33.2064, 35.5711],
        macroAlgae: [
            {
                name: 'Nori', logo: 'assets/logos/CCMAR.webp',
                place: 'Porphyra',
                country: 'Red Algae',
                type: 'red',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ],
                partnerList: ['CCMAR', 'NECTON']
            }
        ]
    },
    {
        name: 'Algaia',
        coords: [49.1114, -1.0664],
        macroAlgae: [
            {
                name: 'Ascophyllum nodosum',
                logo: 'assets/logos/AscophyllumNodosum.jpg',
                place: 'Brittany',
                country: 'France',
                type: 'MacroAlgae',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ],
                partnerList: ['CCMAR', 'NECTON']
            },
            {
                name: 'Saccharina latissima',
                logo: 'assets/logos/CCMAR.webp',
                place: 'Brittany',
                country: 'France',
                type: 'MacroAlgae',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ],
                partnerList: ['CCMAR', 'NECTON']
            },
            {
                name: 'Palmaria palmata',
                logo: 'assets/logos/CCMAR.webp',
                place: 'Brittany',
                country: 'France',
                type: 'MacroAlgae',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ],
                partnerList: ['CCMAR', 'NECTON']
            },
            {
                name: 'Grateloupia turuturu',
                logo: 'assets/logos/CCMAR.webp',
                place: 'Brittany',
                country: 'France',
                type: 'MacroAlgae',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ],
                partnerList: ['CCMAR', 'NECTON']
            },
            {
                name: 'Gelidium madagascariense',
                logo: 'assets/logos/CCMAR.webp',
                place: 'Madagascar',
                country: 'Madagascar',
                type: 'MacroAlgae',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ],
                partnerList: ['CCMAR', 'NECTON']
            },
            {
                name: 'Macricystis pyrifera',
                logo: 'assets/logos/CCMAR.webp',
                place: 'Eastern Pacific',
                country: 'Eastern Pacific',
                type: 'MacroAlgae',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ],
                partnerList: ['CCMAR', 'NECTON']
            }
        ],
        microAlgae: [
            {
                name: 'Nori',
                logo: 'assets/logos/CCMAR.webp',
                place: 'Porphyra',
                country: 'Red Algae',
                type: 'red',
                properties: [
                    'High protein, Vitamins A, B12, C.',
                    'Thin, papery, becomes chewy when hydrated.',
                    'Wrapping sushi rolls.'
                ],
                partnerList: ['CCMAR', 'NECTON']
            }
        ],
    }
    ,
    {
        name: 'BRC',
        coords: [46.2486, 20.1471]
    },
    {
        name: 'ELOOP',
        coords: [40.8358, 14.2487]
    },
    {
        name: 'IRCCS',
        coords: [45.5050, 9.2654]
    },
    {
        name: 'MBU',
        coords: [50.0138, 14.4647]
    },
    {
        name: 'NECTON',
        coords: [37.0396, -7.8340]
    },
    {
        name: 'SOLARIS',
        coords: [45.1950, 10.7954]
    },
    {
        name: 'SYNOVO',
        coords: [48.5369, 9.0401]
    },
    {
        name: 'TEAGASC',
        coords: [52.8624, -6.9158]
    },
    {
        name: 'UNINA',
        coords: [40.8469, 14.2583]
    },
    {
        name: 'VITO',
        coords: [51.2185, 5.0906]
    },
    {
        name: 'YEMOJA',
        coords: [33.15, 35.65]
    }
];