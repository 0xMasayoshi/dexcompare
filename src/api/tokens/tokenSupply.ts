import { JsonRpcProvider } from "@ethersproject/providers";
import { ChainId } from "@sushiswap/sdk";
import { Contract } from "@ethersproject/contracts";
import { rpcUrl } from "../../constants";
import ERC20_ABI from "../../constants/abis/erc20.json";

export async function getTokenSupply(chainId: ChainId, tokenAddress: string) {
  const provider = new JsonRpcProvider(rpcUrl[chainId]);
  const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);
  const totalSupply = await tokenContract.totalSupply();
  return totalSupply;
}
