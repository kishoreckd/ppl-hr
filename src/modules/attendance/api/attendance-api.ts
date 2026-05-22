import { fetchAttendanceRecords, fetchTeamAttendance } from '../services/attendance-service'

export const attendanceApi = {
  getRecords: fetchAttendanceRecords,
  getTeam: fetchTeamAttendance,
}
