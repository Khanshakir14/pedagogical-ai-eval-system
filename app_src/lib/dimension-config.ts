// Dimension configuration for consistent ordering and abbreviations
export const DIMENSION_CONFIG = {
    // Ordered list of dimensions (this order will be used everywhere)
    ORDERED_DIMENSIONS: [
        "Mistake_Identification", // MI - 1st
        "Providing_Guidance", // PG - 2nd
    ],

    // Dimension abbreviations for spider plots
    ABBREVIATIONS: {
        Mistake_Identification: "MI",
        Providing_Guidance: "PG",
    },

    // Full display names
    DISPLAY_NAMES: {
        Mistake_Identification: "Mistake Identification",
        Providing_Guidance: "Providing Guidance",
    },

    // Descriptions for tooltips/help text
    DESCRIPTIONS: {
        Mistake_Identification: "Whether the tutor identifies student mistakes",
        Providing_Guidance: "Whether the tutor provides helpful guidance",
    },
}

// Helper functions
export function getDimensionAbbreviation(dimension: string): string {
    return DIMENSION_CONFIG.ABBREVIATIONS[dimension as keyof typeof DIMENSION_CONFIG.ABBREVIATIONS] || dimension
}

export function getDimensionDisplayName(dimension: string): string {
    return DIMENSION_CONFIG.DISPLAY_NAMES[dimension as keyof typeof DIMENSION_CONFIG.DISPLAY_NAMES] || dimension
}

export function getDimensionDescription(dimension: string): string {
    return DIMENSION_CONFIG.DESCRIPTIONS[dimension as keyof typeof DIMENSION_CONFIG.DESCRIPTIONS] || ""
}

export function getOrderedDimensions(availableDimensions: string[]): string[] {
    // Filter and order dimensions based on the predefined order
    return DIMENSION_CONFIG.ORDERED_DIMENSIONS.filter((dim) => availableDimensions.includes(dim))
}
