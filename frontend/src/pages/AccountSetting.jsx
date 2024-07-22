import ProfileUpdateForm from "../components/ProfileUpdateForm";
import UpdatePasswordForm from "../components/UpdatePasswordForm";

function AccountSetting() {
  return (
    <>
      <ProfileUpdateForm />
      <div className="line">&nbsp;</div>
      <UpdatePasswordForm />
    </>
  );
}

export default AccountSetting;
