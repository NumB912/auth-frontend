 const ProfileSkeleton = () => (
  <div className="max-w-3xl w-full my-10 flex flex-col gap-3">
    {/* Avatar card */}
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col items-center gap-3">
      <div className="w-24 h-24 rounded-full skeleton" />
      <div className="w-36 h-5 skeleton rounded" />
      <div className="w-44 h-4 skeleton rounded" />
    </div>

    {/* Tài khoản card */}
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4">
      <div className="w-20 h-5 skeleton rounded" />
      <div className="flex justify-between items-center p-3 border border-gray-100 rounded-md">
        <div className="w-28 h-4 skeleton rounded" />
        <div className="w-40 h-4 skeleton rounded" />
      </div>
      <div className="flex justify-between items-center p-3 border border-gray-100 rounded-md">
        <div className="w-24 h-4 skeleton rounded" />
        <div className="w-36 h-4 skeleton rounded" />
      </div>
    </div>

    {/* Thông tin cá nhân card */}
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4">
      <div className="w-32 h-5 skeleton rounded" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-3 border border-gray-100 rounded-md flex flex-col gap-2">
            <div className="w-20 h-3 skeleton rounded" />
            <div className="w-24 h-4 skeleton rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default ProfileSkeleton