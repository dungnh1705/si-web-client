import accounting from 'accounting'
import { SemesterEnum } from 'app/enums'

const s1PointDivide = process.env.REACT_APP_S1_POINT_DIVIDE
const s2PointDivide = process.env.REACT_APP_S2_POINT_DIVIDE

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
    const pointDivide = workingSemester === SemesterEnum.semesterOne ? s1PointDivide : workingSemester === SemesterEnum.semesterTwo ? s2PointDivide : 7

    return newVal && Number(newVal.average) === Number(oldVal.average)
      ? accounting.toFixed(
          (Number(newVal.oldTest ?? 0) + Number(newVal.fifteenTest ?? 0) + Number(newVal.lessonTest ?? 0) * 2 + Number(newVal.semesterTest ?? 0) * 3) / Number(pointDivide),
          1
        )
      : newVal.average ?? 0
  }
}
