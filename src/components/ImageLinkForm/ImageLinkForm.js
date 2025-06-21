import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({ onInputChange, onButtonSubmit, isLoading, error }) => {
    return (
    <div>
        <p className='f3 near-white'>
            {'This Magic Brain will detect faces in your picture. Give it a try!'}
        </p>
        {error && (
            <div className='red mb3 center'>
                {error}
            </div>
        )}
        <div className='center'>
            <div className='form center pa3 br3 shadow-5'>
                <input 
                    className='f4 pa2 w-70 center' 
                    type='text' 
                    onChange={onInputChange}
                    placeholder='Enter image URL'
                    disabled={isLoading}
                />
                <button
                 className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'
                 onClick={onButtonSubmit}
                 disabled={isLoading}>
                     {isLoading ? 'Detecting...' : 'Detect'}
                </button>
            </div>
            </div>
    </div>
    )
}

export default ImageLinkForm;