using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Nethereum.Signer;
using Nethereum.Util;
using Nethereum.Web3;
using Newtonsoft.Json;

namespace TestStore
{
    public class Verify
    {
		public static byte[] StringToByteArray(string hex)
		{
			int NumberChars = hex.Length;
			byte[] bytes = new byte[NumberChars / 2];
			for (int i = 0; i < NumberChars; i += 2)
				bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
			return bytes;
		}
		static async Task Main(string[] args)
		{

			var signer = new MessageSigner();
			var message = "10583fab2c57224d8a0d0d7d418386da159b158b02e656efc72f9398b1bb1c05";
			var signature = "aef94afeff3ff3c53a33b4fc7aabc6c94b8b5cffae813d60b606bc6b04ec861b16a21225a3d7cfaa54b33a070b18b1455618d1c2b7be827b75e5a68bf18ce1611c";
			var addressRec1 = signer.EcRecover(StringToByteArray(message), signature);

			Console.WriteLine(message);
			Console.WriteLine(signature);
			Console.WriteLine(addressRec1);

			//Everything below is testing for creating the message on the back end.

			//         var messageObj = new MessageData
			//         {
			//             types = new Types
			//             {
			//		EIP712Domain = new Domain[] 
			//		{
			//			new Domain
			//                     {
			//				name = "name",
			//				type = "string"
			//                     },
			//			new Domain
			//                     {
			//				name = "verifyingContract",
			//				type = "address"
			//			}
			//		},
			//		Identity = new Identity[]
			//                 {
			//			new Identity
			//                     {
			//				name = "account",
			//				type = "uint256"
			//                     }
			//                 }
			//             },
			//	domain = new DomainData
			//             {
			//		name = "Artix App",
			//		verifyingContract = "0xeb391f33b7da0abb89a68adcb92ae10ee7b24e78"
			//	},
			//	primaryType = "Identity",
			//	message = new Message
			//             {
			//		account = "0x13922b3f63f80f683207da9bb2b848a1b87bc7ed"
			//		//contract = "0xeb391f33b7da0abb89a68adcb92ae10ee7b24e78",
			//		//tokenId = "1",
			//		//info = "Sign to verify that you own the selected NFT"
			//	}
			//};
		}
	}

	public class MessageData
    {
		public Types types;
		public DomainData domain;
		public string primaryType;
		public Message message;
    }

	public class Types
	{
		public Domain[] EIP712Domain;
		public Identity[] Identity;
	}

	public class Domain
	{
		public string name;
		public string type;
	}

	public class Identity
	{
		public string name;
		public string type;
	}

	public class DomainData
	{
		public string name;
		public string verifyingContract;
	}

	public class Message
	{
		public string account;
		public string contract;
		public string tokenId;
		public string info;
	}

}
