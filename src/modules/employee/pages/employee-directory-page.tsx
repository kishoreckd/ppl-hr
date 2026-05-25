import { Plus, UsersRound } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { Input } from '../../../shared/components/ui/input'
import { Label } from '../../../shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table'
import {
  useEmployeeDirectoryStore,
  type EmployeeRoleType,
} from '../store/use-employee-directory-store'

export function EmployeeDirectoryPage() {
  const { addEmployee, employees, roles } = useEmployeeDirectoryStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [manager, setManager] = useState('')
  const [role, setRole] = useState<EmployeeRoleType>('Employee')
  const [customRole, setCustomRole] = useState('')

  const managerOptions = useMemo(
    () =>
      Array.from(
        new Set(employees.filter((employee) => employee.role === 'Manager' || employee.role === 'Admin').map((employee) => employee.name)),
      ),
    [employees],
  )

  function submitEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = addEmployee({ customRole, department, email, manager, name, role })
    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    setName('')
    setEmail('')
    setDepartment('')
    setManager('')
    setRole('Employee')
    setCustomRole('')
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce3f1] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#eaf0ff] text-[#1e3fe3]">
              <UsersRound className="size-5" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.08em] text-[#5c6b8e]">Employees</p>
              <h2 className="text-2xl font-black tracking-[-0.03em] text-[#071126]">Employee directory</h2>
            </div>
          </div>
          <Badge tone="neutral">{employees.length} employees</Badge>
        </div>

        <div className="grid gap-4 p-4 xl:grid-cols-[0.94fr_1.06fr]">
          <form className="rounded-2xl border border-[#dce3f1] bg-[#f8f9fb] p-4" onSubmit={submitEmployee}>
            <p className="text-xs font-black uppercase tracking-[0.08em] text-[#5c6b8e]">Add employee</p>
            <h3 className="mt-1 text-xl font-black text-[#071126]">Add new employee with role</h3>
            <div className="mt-4 grid gap-3">
              <Label>
                Full name
                <Input className="mt-2" onChange={(event) => setName(event.target.value)} placeholder="Asha Menon" value={name} />
              </Label>
              <Label>
                Work email
                <Input className="mt-2" onChange={(event) => setEmail(event.target.value)} placeholder="asha@cxontology.com" value={email} />
              </Label>
              <Label>
                Department
                <Input className="mt-2" onChange={(event) => setDepartment(event.target.value)} placeholder="Product Engineering" value={department} />
              </Label>
              <Label>
                Reporting manager
                <Select onValueChange={setManager} value={manager}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {managerOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>
              <Label>
                Role
                <Select onValueChange={(value) => setRole(value as EmployeeRoleType)} value={role}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Custom">Custom role</SelectItem>
                  </SelectContent>
                </Select>
              </Label>
              {role === 'Custom' && (
                <Label>
                  New role name
                  <Input className="mt-2" onChange={(event) => setCustomRole(event.target.value)} placeholder="Data Platform Lead" value={customRole} />
                </Label>
              )}
            </div>
            <Button className="mt-4 w-full" type="submit">
              <Plus className="size-4" />
              Add employee
            </Button>
          </form>

          <div className="rounded-2xl border border-[#dce3f1] bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Manager</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <p className="font-black">{employee.name}</p>
                      <p className="mt-1 text-xs font-semibold text-[#5c6b8e]">{employee.email}</p>
                    </TableCell>
                    <TableCell>
                      <Badge tone={employee.role === 'Admin' ? 'brand' : employee.role === 'Manager' ? 'warning' : 'neutral'}>
                        {employee.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.manager}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="border-t border-[#dce3f1] bg-[#fbfcff] px-4 py-3">
          <p className="text-sm font-semibold text-[#5c6b8e]">
            Roles available: {roles.join(', ')}
          </p>
        </div>
      </Card>
    </div>
  )
}
