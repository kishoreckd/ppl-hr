import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck2,
  HeartHandshake,
  MapPin,
  UserRoundCheck,
} from 'lucide-react'
import { useState } from 'react'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Badge } from '../../../shared/components/ui/badge'
import { Button } from '../../../shared/components/ui/button'
import { Card } from '../../../shared/components/ui/card'
import { Input } from '../../../shared/components/ui/input'
import { Label } from '../../../shared/components/ui/label'
import { SegmentedPills } from '../../../shared/components/ui/segmented-pills'
import { Skeleton } from '../../../shared/components/ui/skeleton'
import { Textarea } from '../../../shared/components/ui/textarea'
import type { IAuthUser } from '../../auth/types/auth-types'
import { ProfileFieldGrid } from '../components/profile-field-grid'
import { ProfileSectionCard } from '../components/profile-section-card'
import { useProfile } from '../hooks/use-profile'
import { useProfileStore } from '../store/use-profile-store'
import type { IEmployeeProfile, IProfileInterest, ProfileSectionType } from '../types/profile-types'
import { formatDisplayName, getInitials } from '../utils/profile-utils'
import {
  profileContactSchema,
  profileInterestsSchema,
  profileOverviewSchema,
  type ProfileContactSchemaType,
  type ProfileInterestsSchemaType,
  type ProfileOverviewSchemaType,
} from '../validations/profile-schema'

const BASE_PROFILE_SECTIONS: Array<{ label: string; value: ProfileSectionType }> = [
  { label: 'Overview', value: 'overview' },
  { label: 'Contact', value: 'contact' },
  { label: 'Interests', value: 'interests' },
  { label: 'Documents', value: 'documents' },
]

export function ProfilePage({ user }: { user: IAuthUser }) {
  const { data: profile, isLoading } = useProfile(user)
  const { activeSection, setActiveSection } = useProfileStore()

  if (isLoading || !profile) {
    return <ProfilePageSkeleton />
  }

  const sections =
    user.role === 'Employee'
      ? BASE_PROFILE_SECTIONS.filter((section) => section.value !== 'documents')
      : BASE_PROFILE_SECTIONS
  const displayName = formatDisplayName(profile.user.name)
  const currentSection = sections.some((section) => section.value === activeSection) ? activeSection : 'overview'

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-[#dce3f1]">
        <div className="h-24 bg-[linear-gradient(135deg,#071126,#1e3fe3_64%,#7ea0ff)]" />
        <div className="space-y-4 p-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="-mt-12 grid size-24 shrink-0 place-items-center rounded-full border-4 border-white bg-[#eaf0ff] text-2xl font-black text-[#1e3fe3] shadow-[0_10px_24px_rgba(13,29,87,0.22)]">
              {getInitials(displayName)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[2rem] leading-tight font-black tracking-[-0.02em] text-[#021333]">
                  {displayName}
                </h2>
                <Badge tone="success">
                  <BadgeCheck className="mr-1 size-3" />
                  Active
                </Badge>
              </div>
              <p className="mt-1 text-sm font-semibold text-[#5c6b8e]">
                {profile.employment.designation} | {profile.employment.department}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[#5c6b8e]">
                <span className="inline-flex items-center gap-1 rounded-md border border-[#dce3f1] bg-[#f8faff] px-2.5 py-1">
                  <BriefcaseBusiness className="size-3.5" />
                  {profile.employment.employeeId}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-[#dce3f1] bg-[#f8faff] px-2.5 py-1">
                  <MapPin className="size-3.5" />
                  {profile.contact.workLocation}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-[#dce3f1] bg-[#f8faff] px-2.5 py-1">
                  <CalendarCheck2 className="size-3.5" />
                  {profile.employment.shift}
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ProfileFact label="Employee ID" value={profile.employment.employeeId} />
            <ProfileFact label="Business Unit" value={profile.employment.businessUnit} />
            <ProfileFact label="Reporting Manager" value={profile.employment.manager} />
            <ProfileFact label="HRBP" value={profile.employment.hrbp} />
          </div>
        </div>
      </Card>

      <Card className="border-[#dce3f1] p-3">
        <SegmentedPills items={sections} onValueChange={setActiveSection} value={currentSection} />
      </Card>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 8 }}
        key={currentSection}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {currentSection === 'overview' && (
          <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <ProfileOverviewForm profile={profile} />
            <div className="space-y-4">
              <ProfileSectionCard eyebrow="Employment" title="Organization details">
                <ProfileFieldGrid
                  fields={[
                    { label: 'Business unit', value: profile.employment.businessUnit },
                    { label: 'Department', value: profile.employment.department },
                    { label: 'Designation', value: profile.employment.designation },
                    { label: 'Shift', value: profile.employment.shift },
                  ]}
                />
              </ProfileSectionCard>
              <ProfileSectionCard eyebrow="Reporting" title="Hierarchy context">
                <div className="grid gap-3 sm:grid-cols-2">
                  <HierarchyItem label="Reporting manager" value={profile.employment.manager} />
                  <HierarchyItem label="HR business partner" value={profile.employment.hrbp} />
                </div>
                <div className="mt-3 rounded-lg border border-[#dce3f1] bg-[#f8faff] p-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.05em] text-[#5c6b8e]">Line management</p>
                  <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#071126]">
                    <UserRoundCheck className="size-4 text-[#1e3fe3]" />
                    {profile.employment.manager} {'->'} {displayName}
                  </p>
                </div>
              </ProfileSectionCard>
            </div>
          </div>
        )}

        {currentSection === 'contact' && <ProfileContactForm profile={profile} />}
        {currentSection === 'interests' && <ProfileInterestsForm profile={profile} />}
        {currentSection === 'documents' && <ProfileDocumentsSection profile={profile} role={user.role} />}
      </motion.div>
    </div>
  )
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#dce3f1] bg-[#f9fbff] px-3.5 py-3">
      <p className="text-[11px] font-black uppercase tracking-[0.05em] text-[#5c6b8e]">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-[#021333]">{value}</p>
    </div>
  )
}

function HierarchyItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#dce3f1] bg-white p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.05em] text-[#5c6b8e]">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-[#021333]">{value}</p>
    </div>
  )
}

function ProfileOverviewForm({ profile }: { profile: IEmployeeProfile }) {
  const form = useForm<ProfileOverviewSchemaType>({
    defaultValues: {
      about: profile.about,
      bio: profile.bio,
    },
    resolver: zodResolver(profileOverviewSchema),
  })

  return (
    <ProfileSectionCard eyebrow="Bio" title="About this employee">
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(() => {
          toast.success('Profile bio updated successfully.')
        })}
      >
        <ProfileTextArea
          error={form.formState.errors.bio?.message}
          label="Bio"
          placeholder="Add a short introduction about yourself."
          register={form.register('bio')}
        />
        <ProfileTextArea
          error={form.formState.errors.about?.message}
          label="Work summary"
          placeholder="Add your working style, ownership areas, or collaboration context."
          register={form.register('about')}
        />
        <div className="pt-1">
          <Button type="submit">Save overview</Button>
        </div>
      </form>
    </ProfileSectionCard>
  )
}

function ProfileContactForm({ profile }: { profile: IEmployeeProfile }) {
  const form = useForm<ProfileContactSchemaType>({
    defaultValues: profile.contact,
    resolver: zodResolver(profileContactSchema),
  })

  return (
    <ProfileSectionCard eyebrow="Contact" title="Contact and location">
      <form
        className="grid gap-4 lg:grid-cols-2"
        onSubmit={form.handleSubmit(() => {
          toast.success('Contact details updated successfully.')
        })}
      >
        <ProfileInput error={form.formState.errors.email?.message} label="Email" register={form.register('email')} />
        <ProfileInput error={form.formState.errors.phone?.message} label="Phone" register={form.register('phone')} />
        <ProfileInput error={form.formState.errors.workLocation?.message} label="Work location" register={form.register('workLocation')} />
        <ProfileInput error={form.formState.errors.address?.message} label="Address" register={form.register('address')} />
        <div className="pt-1 lg:col-span-2">
          <Button type="submit">Save contact</Button>
        </div>
      </form>
    </ProfileSectionCard>
  )
}

function ProfileInterestsForm({ profile }: { profile: IEmployeeProfile }) {
  const [savedInterests, setSavedInterests] = useState<IProfileInterest[]>(profile.interests)
  const form = useForm<ProfileInterestsSchemaType>({
    defaultValues: {
      interests: profile.interests.map((interest) => interest.label).join(', '),
    },
    resolver: zodResolver(profileInterestsSchema),
  })

  return (
    <ProfileSectionCard eyebrow="People profile" title="Bio and interests">
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-[#dce3f1] bg-[#f9fbff] p-4">
          <HeartHandshake className="mb-3 size-7 text-[#1e3fe3]" />
          <p className="text-sm font-semibold text-[#5c6b8e]">
            Add interests as comma-separated values. These stay employee-owned and editable.
          </p>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit((values) => {
              const nextInterests = values.interests
                .split(',')
                .map((interest) => interest.trim())
                .filter(Boolean)
                .map<IProfileInterest>((label, index) => ({
                  label,
                  tone: (['brand', 'success', 'neutral', 'warning'] as const)[index % 4],
                }))
              setSavedInterests(nextInterests)
              toast.success('Interests updated successfully.')
            })}
          >
            <ProfileTextArea
              error={form.formState.errors.interests?.message}
              label="Interests"
              placeholder="Workflow automation, people analytics, OKR planning"
              register={form.register('interests')}
            />
            <Button type="submit">Save interests</Button>
          </form>
        </div>
        <div className="rounded-lg border border-[#dce3f1] bg-white p-4">
          <p className="text-[11px] font-black uppercase text-[#5c6b8e]">Added interests</p>
          {savedInterests.length ? (
            <div className="mt-3 flex flex-wrap content-start gap-2">
              {savedInterests.map((interest) => (
                <Badge className="px-3 py-2" key={interest.label} tone={interest.tone}>
                  {interest.label}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-md border border-dashed border-[#dce3f1] bg-[#f6f8ff] p-4 text-sm font-semibold text-[#5c6b8e]">
              No interests added yet.
            </div>
          )}
        </div>
      </div>
    </ProfileSectionCard>
  )
}

function ProfileDocumentsSection({
  profile,
  role,
}: {
  profile: IEmployeeProfile
  role: IAuthUser['role']
}) {
  const canViewDocuments = role === 'Admin' || role === 'Manager'

  return (
    <ProfileSectionCard eyebrow="Document metadata" title="Profile documents">
      {!canViewDocuments ? (
        <div className="rounded-md border border-dashed border-[#dce3f1] bg-[#f6f8ff] p-4 text-sm font-semibold text-[#5c6b8e]">
          Document metadata is visible to manager and admin roles only.
        </div>
      ) : profile.documents.length ? (
        <div className="space-y-2">
          {profile.documents.map((document) => (
            <div
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#dce3f1] bg-white p-3"
              key={document.title}
            >
              <div>
                <p className="text-sm font-black text-[#021333]">{document.title}</p>
                <p className="text-xs font-semibold text-[#5c6b8e]">
                  {document.category} | Updated {document.lastUpdated}
                </p>
              </div>
              <Badge tone={document.visibility === 'Restricted' ? 'warning' : 'neutral'}>
                {document.visibility}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-[#dce3f1] bg-[#f6f8ff] p-4 text-sm font-semibold text-[#5c6b8e]">
          No document metadata added for this employee.
        </div>
      )}
    </ProfileSectionCard>
  )
}

function ProfileInput({
  error,
  label,
  register,
}: {
  error?: string
  label: string
  register: UseFormRegisterReturn
}) {
  return (
    <Label className="text-sm font-extrabold text-[#021333]">
      {label}
      <Input aria-invalid={Boolean(error)} className="mt-1 h-11 rounded-lg border-[#dce3f1]" {...register} />
      {error && <span className="mt-1 block text-xs font-semibold text-rose-600">{error}</span>}
    </Label>
  )
}

function ProfileTextArea({
  error,
  label,
  placeholder,
  register,
}: {
  error?: string
  label: string
  placeholder: string
  register: UseFormRegisterReturn
}) {
  return (
    <Label className="text-sm font-extrabold text-[#021333]">
      {label}
      <Textarea
        aria-invalid={Boolean(error)}
        className="mt-1 min-h-28 rounded-lg border-[#dce3f1]"
        placeholder={placeholder}
        {...register}
      />
      {error && <span className="mt-1 block text-xs font-semibold text-rose-600">{error}</span>}
    </Label>
  )
}

function ProfilePageSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <Skeleton className="h-24 rounded-none" />
        <div className="space-y-4 p-5">
          <div className="flex gap-4">
            <Skeleton className="size-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-4 w-96" />
              <Skeleton className="h-8 w-full max-w-md" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton className="h-20 rounded-xl" key={index} />
            ))}
          </div>
        </div>
      </Card>
      <Card className="p-3">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </Card>
      <Card className="grid gap-3 p-4 sm:grid-cols-2">
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
      </Card>
    </div>
  )
}
