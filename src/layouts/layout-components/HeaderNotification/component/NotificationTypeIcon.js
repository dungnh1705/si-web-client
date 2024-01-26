import React from 'react'
import { NotificationType } from 'app/enums'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import EditIcon from '@material-ui/icons/Edit'

export const NotificationTypeIcon = {
  [NotificationType.UpdateStudentInformation]: <EditIcon />,
  [NotificationType.ChangeStudentStatus]: <EditIcon />,
  [NotificationType.CreateNewStudent]: <PersonAddIcon />,

  [NotificationType.UpdateStudentScoreSemesterOne]: <EditIcon />,
  [NotificationType.UpdateStudentScoreSemesterTwo]: <EditIcon />,
  [NotificationType.UpdateStudentScoreTotal]: <EditIcon />
}
