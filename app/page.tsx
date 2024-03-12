import React from 'react'

const page = () => {
    return (
        <div>
            <textarea className="code" defaultValue={""} />
            <hr className="under_textarea" />
            <div className="console">
                <p className="console_heading">console</p>
                <hr className="file_manager_hr" />
                <hr className="console_hr" />
                <div className="file_manager_background">
                    <div className="file_manager">
                        <p className="file_manager_text">File manager</p>
                        <button className="close_button" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page