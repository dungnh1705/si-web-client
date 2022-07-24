import React from 'react'
import logo from 'assets/images/loading/waiting.gif'

const SuspenseLoading = () => {
  return (
    <>
      <div className="d-flex align-items-center flex-column vh-100 justify-content-center text-center py-3">
        <div className="d-flex align-items-center flex-column px-4">
          <img src={logo} alt="loading" />
        </div>
        <div className="text-muted font-size-xl text-center pt-3">Đợi chúng tôi xử lý dữ liệu.</div>
      </div>
    </>
  )
}

export default SuspenseLoading
