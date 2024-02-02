import Link from 'next/link'
import './index.css'
import { useState } from 'react'

export default function Sidebar() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true)
  return (
    <div
      className='sidebar'
      onMouseOver={() => setSidebarIsOpen(true)}
      onMouseOut={() => setSidebarIsOpen(false)}
    >
      <div className='sidebar-icons'>
        <div className='top-sidebar'>
          <div className='sidebar-logo'>
            <Link href='/'>
              <div className='sidebar-icon sidebar-dashboard-btn'>
                <span className='material-symbols-outlined'>home</span>
                <span className='icon-text'>home</span>
              </div>
            </Link>
          </div>
        </div>

        {/* make dashboard link redirect to survey page if the user has not filled it out yet */}
        <Link href='/'>
          <div className='sidebar-icon dashboard sidebar-dashboard-btn'>
            <span className='material-symbols-outlined dashboard'>
              desktop_windows
            </span>
            <span className='icon-text'>Dashboard</span>
          </div>
        </Link>
        <Link href='/ExploreCoaches'>
          <div className='sidebar-icon sidebar-explore coaches-btn'>
            <span className='material-symbols-outlined'>explore</span>
            <span className='icon-text'>EXPLORE COACHES</span>
          </div>
        </Link>

        <>
          <Link href='/ManageCoaches'>
            <div className='sidebar-icon sidebar-manage-coaches-btn'>
              <span class='material-symbols-outlined'>manage_accounts</span>{' '}
              <span className='icon-text'>MANAGE COACHES</span>
            </div>
          </Link>
          <Link href='/ManageExercises'>
            <div className='sidebar-icon sidebar-manage-exercises-btn'>
              <span class='material-symbols-outlined'>folder_managed</span>
              <span className='icon-text'>MANAGE EXERCISES</span>
            </div>
          </Link>
        </>

        <Link href='/MyCoach'>
          <div className='sidebar-icon sidebar-my-coach-btn'>
            <span className='material-symbols-outlined'>group</span>
            <span className='icon-text'>MY COACH</span>
          </div>
        </Link>
        <Link href='/Workouts'>
          <div className='sidebar-icon sidebar-my-workouts-btn'>
            <span className='material-symbols-outlined'>exercise</span>
            <span className='icon-text'>MY WORKOUTS</span>
          </div>
        </Link>

        <div className='bottom-sidebar'>
          <Link href='/Profile'>
            <div className='sidebar-icon sidebar-profile-btn'>
              <span className='material-symbols-outlined'>account_circle</span>
              <span className='icon-text'>PROFILE</span>
            </div>
          </Link>
          <Link href='/'>
            <div className='sidebar-icon sidebar-logout-btn'>
              <span className='material-symbols-outlined'>logout</span>
              <span className='icon-text'>LOG OUT</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
