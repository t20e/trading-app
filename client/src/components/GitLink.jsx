import React, { useState } from 'react';

const GitLink = () => {
    return (
        <div className='gitLink'>
            <div className="gitLinkAlert">
                <div>
                    <h4>find a bug? or have questions about this app? let me know!</h4>
                </div>
            </div>
            {/* TODO change this link */}
            <a href="https://github.com/t20e/message_app">
                <img id="linkImg" src={"https://portfolio-avis-s3.s3.amazonaws.com/app/icons/gitCodeLink_img-01.png"} alt="link img" />
            </a>
        </div>
    );
};

export default GitLink;