import accounting from 'accounting'

import config from 'config'
import { SemesterEnum } from 'app/enums'

export default {
  calculateRating(avg) {
    if (avg >= 9.5) return 'Xuất sắc'
    else if (avg < 9.5 && avg >= 8.5) return 'Giỏi'
    else if (avg < 8.5 && avg >= 7) return 'Khá'
    else if (avg < 7 && avg >= 5) return 'Trung bình'
    else if (avg < 5 && avg >= 3.5) return 'Yếu'
    else return 'Kém'
  },

  calculateAvgScore(workingSemester, oldVal, newVal) {
    // console.log({ ...oldVal })
    const pointDivide = workingSemester === SemesterEnum.semesterOne ? config.PointDivide : workingSemester === SemesterEnum.semesterTwo ? config.S2PointDivide : 7

    return newVal && Number(newVal.average) === Number(oldVal.average)
      ? accounting.toFixed(
          (Number(newVal.oldTest ?? 0) + Number(newVal.fifteenTest ?? 0) + Number(newVal.lessonTest ?? 0) * 2 + Number(newVal.semesterTest ?? 0) * 3) / Number(pointDivide),
          1
        )
      : newVal.average ?? 0
  }
}
