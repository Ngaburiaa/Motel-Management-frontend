// import { useForm } from "react-hook-form";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import toast from "react-hot-toast";

// export const SupportTicketModal = () => {
//   const { register, handleSubmit, reset } = useForm();

//   const onSubmit = (data: any) => {
//     toast.success("Support ticket created");
//     reset();
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="default" size="sm">
//           + New Ticket
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <h2 className="text-lg font-semibold">Create Support Ticket</h2>
//           <Input {...register("subject", { required: true })} placeholder="Subject" />
//           <Textarea {...register("message", { required: true })} placeholder="Describe your issue..." />
//           <Button type="submit" className="w-full">Submit</Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };