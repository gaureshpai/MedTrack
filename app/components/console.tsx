import React from 'react'
import '@/public/styles/console.css'

const Console = () => {
  return (
    <>
          <div className="console">
              <p className="console_heading">console</p>
              <hr className="console_hr"/>
              <div className="file_manager_background">
                <div className="file_manager">
                  <div className="a">
                    <p className="file_manager_text">File manager</p>
                    <button className="close_button"></button>
                  </div>
                  <hr className="file_manager_hr"/>
                </div>
              </div>
          </div>
    </>
  )
}

export default Console