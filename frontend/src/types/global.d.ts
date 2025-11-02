declare module 'react-rating-stars-component' {
    import React from 'react'

    interface ReactStarsProps {
        count?: number
        value?: number
        size?: number
        color?: string
        activeColor?: string
        edit?: boolean
        isHalf?: boolean
        onChange?: (newRating: number) => void
    }

    const ReactStars: React.FC<ReactStarsProps>
    export default ReactStars
}
