import React from 'react'

const FullViewContainer = (props)=>{
    return <div>
                <div className="full-view p-d-flex p-ai-center p-jc-center">
                    <div>
                        {props.children}
                    </div>
                </div>
            </div>
}

export default FullViewContainer;