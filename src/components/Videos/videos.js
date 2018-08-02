import React from 'react';
import VideosList from '../widgets/VideosList/videosList';

const Videos = () => {
    return (
        <div>
            <VideosList
                type="card"
                title={false}
                loadmore={true}
                start={0}
                end={6}
                load_amount={6}
            />
        </div>
    )
}

export default Videos;