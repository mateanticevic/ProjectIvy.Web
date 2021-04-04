export interface MovieFilters {
    ratingHigher?: number,
    ratingLower?: number,
    runtimeLonger?: number,
    runtimeShorter?: number,
}

export interface Movie {
    imdbId: string,
    timestamp: string,
    title: string,
    runtime: number,
    myRating: number,
    year: number,
}